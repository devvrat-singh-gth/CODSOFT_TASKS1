  export function EmptyState({ title, description }: { title: string; description?: string }) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
        <p className="text-lg font-medium">{title}</p>
        {description && <p className="text-sm text-foreground/60">{description}</p>}
      </div>
    );
  }
