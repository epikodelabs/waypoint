import { Component, input } from '@angular/core';

type DataInput = Record<string, unknown>;
interface AdminAudit {
  readonly reviewedBy: string;
  readonly reviewerRole: string;
  readonly workspaceLoads: number;
}

const pageStyles = `
  .page {
    display: grid;
    gap: 1rem;
  }

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .page-header h1 {
    margin: 0.25rem 0 0;
    font-size: clamp(1.9rem, 3vw, 2.7rem);
  }

  .status-pill {
    padding: 0.55rem 0.8rem;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent-deep);
    font-weight: 700;
  }

  .page-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: 1rem;
  }

  .panel {
    padding: 1.1rem;
    border: 1px solid var(--border-color);
    border-radius: 1.1rem;
    background: var(--panel-strong);
  }

  .panel h3 {
    margin-top: 0;
  }

  .panel p {
    line-height: 1.6;
  }

  .data-list {
    display: grid;
    gap: 0.7rem;
    margin: 0;
  }

  .data-list div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .data-list dt {
    color: var(--ink-soft);
  }

  .data-list dd {
    margin: 0;
    font-weight: 700;
    color: var(--ink-strong);
  }

  .action-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .action-link,
  .action-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.9rem;
    padding: 0.75rem 1rem;
    border-radius: 999px;
    border: 1px solid rgb(43 92 230 / 0.18);
    background: rgb(255 255 255 / 0.8);
    color: var(--ink-strong);
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
  }

  .inline-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.85rem;
    font-weight: 600;
  }
`;

const sidebarStyles = `
  .sidebar-card {
    display: grid;
    gap: 0.75rem;
  }

  .sidebar-card h3 {
    margin: 0;
  }

  .sidebar-card p,
  .sidebar-card li {
    line-height: 1.55;
  }

  .sidebar-card ul {
    margin: 0;
    padding-left: 1.15rem;
  }

  .sidebar-links {
    display: grid;
    gap: 0.55rem;
  }

  .sidebar-links a {
    padding: 0.8rem 0.9rem;
    border-radius: 0.9rem;
    background: rgb(43 92 230 / 0.07);
    color: var(--ink-strong);
    text-decoration: none;
  }
`;

@Component({
  standalone: true,
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">server authorization + prepare</p>
          <h1>Admin console</h1>
        </div>
        <span class="status-pill">server authorized</span>
      </header>

      <div class="page-grid">
        <article class="panel">
          <h3>Delivery boundary</h3>
          <p>
            This page is compiled into a separate administration artifact and
            is delivered only after server authorization succeeds.
          </p>
        </article>
        <article class="panel">
          <h3>Prepared audit</h3>
          <p>reviewedBy: <strong>{{ audit()?.reviewedBy }}</strong></p>
          <p>reviewerRole: <strong>{{ audit()?.reviewerRole }}</strong></p>
          <p>workspaceLoads: <strong>{{ audit()?.workspaceLoads ?? 0 }}</strong></p>
        </article>
      </div>
    </section>
  `,
  styles: [pageStyles],
})
export class AdminPage {
  protected readonly data = input<DataInput>({});

  protected audit(): AdminAudit | null {
    return (this.data()['audit'] as AdminAudit | undefined) ?? null;
  }
}

@Component({
  standalone: true,
  template: `
    <section class="sidebar-card">
      <h3>Admin sidebar</h3>
      <p>
        This route is useful for checking that a successful guard still commits
        both outlets together.
      </p>
    </section>
  `,
  styles: [sidebarStyles],
})
export class AdminSidebarComponent {}
