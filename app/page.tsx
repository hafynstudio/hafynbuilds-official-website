"use client";

// ============================================================================
// TEMPORARY — Phase 2 component QA showcase.
// This entire file is replaced by the real Hero + sections in Phase 4 & 5.
// Its only purpose is to let us visually verify every UI primitive
// (Button, Card, Input, Skeleton, Modal, CustomCursor) renders and behaves
// correctly before committing Phase 2. Do not treat this as final Home
// page content or design.
// ============================================================================

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <main className="min-h-screen space-y-16 p-8 md:p-16">
      <section>
        <h1 className="mb-6 text-3xl font-bold">Phase 2 — QA Showcase</h1>
        <p className="mb-8 max-w-xl text-text-secondary">
          Temporary page. Real Home content ships in Phase 4 &amp; 5.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary Magnetic</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" isLoading>
            Loading
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="primary" href="/about">
            As Link
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Cards</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>Static card</Card>
          <Card interactive>Interactive — hover me</Card>
          <Card interactive noise>
            Interactive + grain
          </Card>
        </div>
      </section>

      <section className="max-w-sm space-y-4">
        <h2 className="text-xl font-semibold">Input</h2>
        <Input
          label="Email address"
          type="email"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Input label="With an error" error="This field is required" />
        <Input label="With a hint" hint="We'll never share this." />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Skeletons</h2>
        <div className="max-w-sm space-y-3">
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="circle" width={48} height={48} />
          <Skeleton variant="card" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Modal</h2>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Open Modal
        </Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="QA Test Modal"
        >
          <div className="p-8">
            <h3 className="mb-4 text-2xl font-bold">Test Modal Content</h3>
            <p className="mb-4 text-text-secondary">
              Resize the browser below 768px to see this switch to a
              bottom-sheet with drag-to-dismiss. Press Escape or click the
              backdrop to close. Tab should stay trapped inside this modal.
            </p>
            <Input label="A field inside the modal" />
          </div>
        </Modal>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Custom Cursor</h2>
        <p className="text-text-secondary">
          Move your mouse anywhere on this page (desktop only) — it should
          be a small dot that morphs into a ring when hovering the buttons/
          inputs above.
        </p>
      </section>
    </main>
  );
}
