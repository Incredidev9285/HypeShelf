import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-primary)] opacity-10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--accent-secondary)] opacity-10 blur-[100px] rounded-full" />
      </div>
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-[var(--background-secondary)] border border-[var(--border-color)] shadow-2xl",
            headerTitle: "text-[var(--foreground)]",
            headerSubtitle: "text-[var(--foreground-muted)]",
            socialButtonsBlockButton: "bg-[var(--background-tertiary)] border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--background)]",
            formFieldLabel: "text-[var(--foreground-muted)]",
            formFieldInput: "bg-[var(--background)] border-[var(--border-color)] text-[var(--foreground)]",
            formButtonPrimary: "bg-[var(--accent-primary)] hover:opacity-90",
            footerActionLink: "text-[var(--accent-secondary)] hover:text-[var(--accent-primary)]",
          },
        }}
      />
    </div>
  );
}
