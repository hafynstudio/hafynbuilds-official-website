"use client";

import { useEffect, useId, useRef, useState, useCallback, Fragment } from "react";
import { flushSync } from "react-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { contactSchema, type ContactFormData } from "@/lib/contact-schema";
import {
  useIsClient,
  useMediaQuery,
  usePrefersReducedMotion,
} from "@/lib/hooks";
import { EASE_OUT_EXPO, EASE_OUT_QUART, FRAMER_COLOR_TOKENS, rgbaToken } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { socialLinks } from "@/data/social-links";
import { trackEvent } from "@/lib/analytics";

const STORAGE_KEY = "hafyn_contact_draft";

const PROJECT_TYPES = [
  { value: "website",    label: "Website" },
  { value: "web-app",    label: "Web App" },
  { value: "software",   label: "Software / SaaS" },
  { value: "ai-system",  label: "AI System" },
  { value: "enterprise", label: "Enterprise" },
  { value: "not-sure",   label: "Not Sure Yet" },
] as const;

const BUDGET_RANGES = [
  { value: "under-25k",  label: "Under PKR 25,000" },
  { value: "25k-50k",    label: "PKR 25k – 50k" },
  { value: "50k-100k",   label: "PKR 50k – 100k" },
  { value: "100k-250k",  label: "PKR 100k – 250k" },
  { value: "250k-plus",  label: "PKR 250k+" },
] as const;

const TIMELINES = [
  { value: "immediately",    label: "Immediately" },
  { value: "within-1-month", label: "Within 1 Month" },
  { value: "1-3-months",     label: "1–3 Months" },
  { value: "flexible",       label: "Flexible" },
] as const;

const STEP_LABELS = ["Your Details", "Project Info", "The Vision"];

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp",
];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const STEP_FIELDS: (keyof ContactFormData)[][] = [
  ["name", "email", "phone", "company"],
  ["projectType", "budgetRange", "timeline"],
  ["message"],
];

const GLASS_CARD = cn(
  "relative overflow-hidden rounded-card",
  "border border-border-hairline bg-bg-elevated",
  "shadow-card-rest",
  "before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px",
  "before:rounded-t-card",
  "before:bg-gradient-to-r before:from-transparent before:via-white/8 before:to-transparent"
);

// FIX (Phase 2, A11Y-001): the segmented pickers (Project Type / Budget /
// Timeline) previously rendered as bare button groups with no group
// semantics and no selected-state announcement — screen-reader and keyboard
// users could not tell which option was active. They now use the proper
// radiogroup pattern: a <fieldset>/<legend> label, role="radio" +
// aria-checked on each option, roving tabindex, and Arrow-key navigation.
// The visual design is unchanged — this is semantic HTML over the same
// buttons.
function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  error,
}: {
  options: readonly { value: T; label: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
  label: string;
  error?: string;
}) {
  const errorId = useId();
  return (
    <fieldset className="w-full">
      <legend className="mb-3 text-sm font-medium text-text-secondary">{label}</legend>
      <div
        role="radiogroup"
        aria-label={label}
        aria-describedby={error ? errorId : undefined}
        className="flex flex-wrap gap-2"
      >
        {options.map((opt, index) => {
          const active = value === opt.value;
          // Roving tabindex: the selected option (or the first, when none
          // is selected yet) is the only tab stop; the rest are reachable
          // with the Arrow keys.
          const tabIndex = active || (value === undefined && index === 0) ? 0 : -1;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={tabIndex}
              onClick={() => onChange(opt.value)}
              onKeyDown={(e) => {
                const isLeft = e.key === "ArrowLeft" || e.key === "ArrowUp";
                const isRight = e.key === "ArrowRight" || e.key === "ArrowDown";
                if (!isLeft && !isRight) return;
                e.preventDefault();
                const dir = isRight ? 1 : -1;
                const nextIndex = (index + dir + options.length) % options.length;
                const nextValue = options[nextIndex].value;
                // Move focus to the sibling option and select it.
                const siblings = e.currentTarget.parentElement?.children;
                (siblings?.[nextIndex] as HTMLButtonElement | undefined)?.focus();
                onChange(nextValue);
              }}
              className={cn(
                "min-h-[48px] rounded-lg border px-5 text-sm font-medium transition-all duration-base ease-out-quart sm:min-h-[40px] sm:px-4",
                "active:scale-[0.96]",
                active
                  ? "border-accent bg-accent/10 text-accent shadow-[0_0_16px_rgba(62,123,250,0.25)]"
                  : "border-border bg-surface/60 text-text-secondary hover:border-border-hover hover:text-text-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-elevated"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        {Array.from({ length: total }).map((_, i) => {
          const isDone = i < current;
          const isActive = i === current;
          return (
            <Fragment key={i}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-base ease-out-quart",
                    isDone && "border-accent bg-accent text-white",
                    isActive &&
                      "border-accent bg-accent/10 text-accent shadow-[0_0_14px_rgba(62,123,250,0.45)]",
                    !isDone && !isActive && "border-border bg-surface text-text-tertiary"
                  )}
                >
                  {isDone ? (
                    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                      <path
                        d="M3 8.5L6.5 12L13 4.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
              </div>
              {i < total - 1 && (
                <div className="relative mx-2 h-px flex-1 overflow-hidden bg-border">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent-glow"
                    initial={false}
                    animate={{ width: i < current ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-widest text-text-secondary">
        {STEP_LABELS[current]}
      </p>
    </div>
  );
}

function SuccessCheckmark() {
  return (
    <motion.svg
      viewBox="0 0 52 52"
      className="h-20 w-20 sm:h-16 sm:w-16"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
    >
      <motion.circle
        cx="26" cy="26" r="25" fill="none"
        stroke={rgbaToken(FRAMER_COLOR_TOKENS.success, 1)}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT_QUART }}
      />
      <motion.path
        fill="none"
        stroke={rgbaToken(FRAMER_COLOR_TOKENS.success, 1)}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.1 27.2l7.1 7.2 16.7-16.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.4, ease: EASE_OUT_QUART }}
      />
    </motion.svg>
  );
}

interface ContactFormProps {
  replyWindow: string;
}

export function ContactForm({ replyWindow }: ContactFormProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const isClient = useIsClient();

  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const stepRef = useRef<HTMLDivElement>(null);
  const firstFieldRefs = useRef<(HTMLElement | null)[]>([null, null, null]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const whatsapp = socialLinks.find((l) => l.platform === "whatsapp");

  useEffect(() => {
    trackEvent("contact_form_view", { form: "build_request" });
  }, []);

  const {
    control,
    register,
    handleSubmit,
    trigger,
    setValue,
    reset,
    formState: { errors, dirtyFields, touchedFields },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: loadDraft(),
    mode: "onTouched",
  });

  // FIX (audit item 3): "touched" fires on ANY blur, including a blur
  // caused by the auto-focus effect below losing focus to an unrelated
  // UI interaction (e.g. clicking into browser DevTools in responsive
  // mode) -- with zero characters typed. This produced an error showing
  // on a field the user never actually interacted with. Gating error
  // *display* behind "dirty" (has the value actually changed from
  // default) AND "touched" (user genuinely blurred the field) fixes
  // this at the render level without touching validation timing itself.
  function fieldError(field: "name" | "email" | "phone" | "company" | "message") {
    return dirtyFields[field] && touchedFields[field] ? errors[field]?.message : undefined;
  }

  const formValues = useWatch({ control });
  const projectType = useWatch({ control, name: "projectType" });
  const budgetRange = useWatch({ control, name: "budgetRange" });
  const timeline = useWatch({ control, name: "timeline" });
  // FIX (Phase 2, CONV-005): draft autosave is debounced (400ms) so a
  // single keystroke no longer serializes the entire form to localStorage.
  useEffect(() => {
    if (isSuccess) return;
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => saveDraft(formValues), 400);
    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [formValues, isSuccess]);

  useEffect(() => {
    const el = firstFieldRefs.current[step];
    if (el) {
      const t = setTimeout(() => el.focus({ preventScroll: true }), 120);
      return () => clearTimeout(t);
    }
  }, [step]);

  const scrollStepIntoView = useCallback(() => {
    if (stepRef.current && isMobile) {
      stepRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isMobile]);

  async function goNext() {
    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields);
    if (!valid) {
      trackEvent("contact_form_validation_failure", { form: "build_request", step });
      return;
    }
    const nextStep = step + 1;
    setStep(nextStep);
    trackEvent("contact_form_step_complete", { form: "build_request", step: nextStep });
    scrollStepIntoView();
  }

  function goBack() {
    const previousStep = Math.max(0, step - 1);
    setStep(previousStep);
    trackEvent("contact_form_step_back", { form: "build_request", step: previousStep });
    scrollStepIntoView();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAttachmentError(null);
    if (!file) { setAttachedFile(null); return; }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      trackEvent("contact_form_attachment_rejected", { form: "build_request", reason: "type" });
      setAttachmentError("Allowed: PDF, DOC, DOCX, PNG, JPG, WEBP");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      trackEvent("contact_form_attachment_rejected", { form: "build_request", reason: "size" });
      setAttachmentError(`File must be under ${MAX_FILE_SIZE_MB}MB`);
      e.target.value = "";
      return;
    }
    setAttachedFile(file);
  }

  function removeFile() {
    setAttachedFile(null);
    setAttachmentError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // BUGFIX (loading animation reliability, flushSync): React 18+ batches
  // state updates from async function continuations (after `await`) in the
  // same microtask cycle as synchronous state updates at the top of the
  // function. This means `setIsSubmitting(true)` can be batched together
  // with `setIsSubmitting(false)` + `setIsSuccess(true)` from the finally
  // /catch block when the fetch resolves on the same microtask tick,
  // collapsing the loading state before the UI ever paints it. Wrapping
  // the loading-state setters in `flushSync()` forces React to commit the
  // update synchronously before any `await`, guaranteeing the spinner
  // renders for the full duration of the async operation.
  async function onSubmit(data: ContactFormData) {
    flushSync(() => {
      setIsSubmitting(true);
      setSubmitError(null);
    });
    trackEvent("contact_form_submit_attempt", {
      form: "build_request",
      project_type: data.projectType,
      has_attachment: Boolean(attachedFile),
    });
    try {
      const body = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) body.append(key, String(value));
      });
      if (attachedFile) body.append("attachment", attachedFile, attachedFile.name);

      const res = await fetch("/api/contact", {
        method: "POST",
        body,
      });
      const json = await res.json().catch(() => ({ success: false, message: "Unexpected server response" }));
      if (!res.ok || !json.success) throw new Error(json.message || "Submission failed");

      trackEvent("contact_form_submit_success", {
        form: "build_request",
        project_type: data.projectType,
        has_attachment: Boolean(attachedFile),
      });
      clearDraft();
      setIsSuccess(true);
    } catch (err) {
      trackEvent("contact_form_submit_failure", {
        form: "build_request",
        project_type: data.projectType,
        has_attachment: Boolean(attachedFile),
        failure_type: err instanceof TypeError ? "network" : "server",
      });
      // FIX (Phase 2, CONV-001): distinguish a network failure (fetch
      // rejects with a TypeError) from an application error, so the user
      // always gets an honest, human-readable state — never "Failed to
      // fetch".
      if (err instanceof TypeError) {
        setSubmitError(
          "We couldn't reach the server. Please check your connection and try again."
        );
      } else {
        setSubmitError(
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    reset();
    setStep(0);
    setIsSuccess(false);
    setAttachedFile(null);
    setAttachmentError(null);
    setSubmitError(null);
  }

  const stepVariants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT_EXPO } },
        exit: { opacity: 0, y: -16, transition: { duration: 0.25, ease: EASE_OUT_QUART } },
      };

  const successVariants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
        exit: { opacity: 0, scale: 0.96, transition: { duration: 0.3 } },
      };

  if (isSuccess) {
    return (
      <motion.div
        key="success"
        variants={successVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn(GLASS_CARD, "flex flex-col items-center justify-center p-8 text-center sm:p-12")}
      >
        <SuccessCheckmark />
        <h3 className="mt-6 text-2xl font-semibold text-text-primary sm:text-3xl">
          Your build request is in.
        </h3>
        <p className="mt-3 text-base text-text-secondary sm:text-lg">
          We&apos;ll be in touch <span className="font-medium text-text-primary">{replyWindow}</span>.
        </p>
        {whatsapp && (
          <a
            href={whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-whatsapp/30 bg-whatsapp/5 px-5 py-3 text-sm font-medium text-whatsapp transition-colors hover:bg-whatsapp/10 active:scale-[0.98]"
          >
            Want it faster? Message on WhatsApp →
          </a>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="mt-6 text-sm text-text-tertiary underline underline-offset-4 transition-colors hover:text-text-primary"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  const isFinalStep = step === 2;

  // BUGFIX (Continue bar no longer overlaps Footer): Previously this bar
  // used `fixed` positioning via createPortal(document.body), which pinned
  // it to the viewport regardless of scroll position -- when the user
  // scrolled past the form into the Footer, the bar stayed visible on top
  // of Footer content. Now it uses `sticky bottom-0` inside a
  // position-relative wrapper that scopes the sticky boundary to the form
  // section itself. The bar scrolls away naturally once the wrapper's
  // bottom edge passes the viewport, never overlapping Footer.
  // The wrapper extends past the parent's `px-5` padding so the bar spans
  // the full viewport width on mobile, matching the original visual.
  const mobileActionBar = (
    <div
      className="sticky bottom-0 z-modal -mx-5 w-[calc(100%+40px)] border-t border-border/80 bg-bg-primary/95 px-5 pt-3 backdrop-blur-xl sm:hidden sm:mx-0 sm:w-auto"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
    >
      <div className="flex items-center gap-3">
        {step > 0 && (
          <Button variant="secondary" size="lg" onClick={goBack} type="button" className="min-w-[96px]">
            ← Back
          </Button>
        )}
        {!isFinalStep ? (
          <Button variant="primary" size="lg" onClick={goNext} type="button" fullWidth>
            Continue →
          </Button>
        ) : (
          <Button
            variant="primary" size="lg" type="button"
            onClick={() => handleSubmit(onSubmit)()}
            isLoading={isSubmitting} disabled={isSubmitting} fullWidth
          >
            {isSubmitting ? "Sending..." : "Send It →"}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div aria-hidden="true" className="absolute -left-[9999px] -top-[9999px] opacity-0">
          <input type="text" tabIndex={-1} autoComplete="off" aria-label="Leave this field empty" {...register("hp_field")} />
        </div>

        <div className={cn(GLASS_CARD, "p-6 sm:p-8", isMobile && "pb-6")}>
          <StepIndicator current={step} total={3} />

          <div ref={stepRef}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step-0" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
                  {(() => {
                    const nameField = register("name");
                    return (
                      <Input
                        label="Full Name *"
                        error={fieldError("name")}
                        autoComplete="name"
                        {...nameField}
                        ref={(el) => { nameField.ref(el); firstFieldRefs.current[0] = el; }}
                      />
                    );
                  })()}
                  <Input label="Email Address *" type="email" inputMode="email" autoComplete="email" error={fieldError("email")} {...register("email")} />
                  <Input label="Phone Number" type="tel" inputMode="tel" autoComplete="tel" error={fieldError("phone")} {...register("phone")} />
                  <Input label="Company Name (optional)" autoComplete="organization" error={fieldError("company")} {...register("company")} />
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step-1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-7">
                  <SegmentedControl label="Project Type *" options={PROJECT_TYPES} value={projectType} onChange={(v) => setValue("projectType", v, { shouldValidate: true })} error={errors.projectType?.message} />
                  <SegmentedControl label="Budget Range *" options={BUDGET_RANGES} value={budgetRange} onChange={(v) => setValue("budgetRange", v, { shouldValidate: true })} error={errors.budgetRange?.message} />
                  <SegmentedControl label="Timeline *" options={TIMELINES} value={timeline} onChange={(v) => setValue("timeline", v, { shouldValidate: true })} error={errors.timeline?.message} />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step-2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                  <div className="w-full">
                    <div className="relative">
                      {(() => {
                        const messageField = register("message");
                        return (
                          <textarea
                            id="message" placeholder=" " rows={6}
                            aria-invalid={!!fieldError("message")}
                            aria-describedby={fieldError("message") ? "message-error" : undefined}
                            className={cn(
                              "peer w-full resize-none rounded-md border bg-surface px-4 pt-7 pb-3 text-base text-text-primary",
                              "transition-colors duration-base ease-out-quart",
                              "placeholder-transparent focus:outline-none",
                              fieldError("message") ? "border-error focus:border-error" : "border-border focus:border-accent",
                              "focus:shadow-[0_0_0_3px_rgb(var(--color-accent-primary)/0.15)]"
                            )}
                            {...messageField}
                            ref={(el) => { messageField.ref(el); firstFieldRefs.current[2] = el; }}
                          />
                        );
                      })()}
                      <label htmlFor="message" className={cn(
                        "pointer-events-none absolute left-4 top-4 origin-left text-text-tertiary transition-all duration-fast ease-out-quart",
                        "peer-focus:top-2 peer-focus:scale-75 peer-focus:text-accent",
                        "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-75"
                      )}>
                        Describe your project *
                      </label>
                    </div>
                    {fieldError("message") && (
                      <p id="message-error" className="mt-1.5 text-sm text-error" role="alert">{fieldError("message")}</p>
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-text-secondary">Attach a brief or reference (optional)</p>
                    {attachedFile ? (
                      <div className="flex items-center justify-between gap-3 rounded-md border border-accent/30 bg-accent/5 px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-text-primary">{attachedFile.name}</p>
                          <p className="text-xs text-text-tertiary">{(attachedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button type="button" onClick={removeFile} className="shrink-0 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-error/50 hover:text-error">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className={cn(
                        "flex min-h-[56px] cursor-pointer items-center gap-3 rounded-md border border-dashed border-border bg-surface/30 px-4 py-3 transition-colors",
                        "hover:border-border-hover hover:bg-surface/60",
                        "focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgb(var(--color-accent-primary)/0.15)]"
                      )}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 shrink-0 text-text-tertiary">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                        <span className="text-sm text-text-tertiary">PDF, DOC, DOCX, PNG, JPG, WEBP — max 10MB</span>
                        <input ref={fileInputRef} type="file" className="sr-only" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp" onChange={handleFileChange} />
                      </label>
                    )}
                    {attachmentError && <p className="mt-1.5 text-sm text-error" role="alert">{attachmentError}</p>}
                  </div>

                  <p className="text-sm text-text-tertiary">
                    Prefer to talk first?{" "}
                    {whatsapp ? (
                      <a
                        href={`${whatsapp.url}?text=${encodeURIComponent(
                          "Hi HAFYN, I'd like to book a call about a build."
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-secondary underline underline-offset-4 transition-colors hover:text-text-primary"
                      >
                        Book a call →
                      </a>
                    ) : (
                      <span className="text-text-secondary">Book a call</span>
                    )}
                  </p>

                  {submitError && (
                    <p className="rounded-md border border-error/20 bg-error/5 px-4 py-3 text-sm text-error" role="alert">{submitError}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={cn("mt-8 hidden justify-between gap-3 sm:flex", step === 0 && "sm:justify-end")}>
            {step > 0 && (
              <Button variant="ghost" size="md" onClick={goBack} type="button">← Back</Button>
            )}
            {!isFinalStep ? (
              <Button variant="primary" size="lg" onClick={goNext} type="button">Continue →</Button>
            ) : (
              <Button variant="primary" size="lg" type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send It →"}
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Mobile action bar — NOT portaled, rendered as sibling of <form>
          inside the position-relative wrapper. Uses `sticky bottom-0` so
          it scrolls away with the form container instead of overlapping
          Footer (BUG 3 fix). */}
      {isClient && isMobile && mobileActionBar}
    </div>
  );
}

function loadDraft(): Partial<ContactFormData> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDraft(data: Partial<ContactFormData>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}