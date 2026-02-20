"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface GitCmd {
  name: string;
  desc: string;
  cmd: string;
  category: string;
  tags: string[];
}

const GIT_COMMANDS: GitCmd[] = [
  // Setup
  { name: "Initialize repo", desc: "Create a new git repository", cmd: "git init", category: "Setup", tags: ["init", "new", "create"] },
  { name: "Clone repo", desc: "Clone a remote repository", cmd: "git clone <url>", category: "Setup", tags: ["clone", "download", "copy"] },
  { name: "Set username", desc: "Set your git username globally", cmd: "git config --global user.name \"Your Name\"", category: "Setup", tags: ["config", "name", "user"] },
  { name: "Set email", desc: "Set your git email globally", cmd: "git config --global user.email \"you@example.com\"", category: "Setup", tags: ["config", "email"] },
  // Basics
  { name: "Check status", desc: "See working tree status", cmd: "git status", category: "Basics", tags: ["status", "changes"] },
  { name: "Stage all changes", desc: "Add all changed files to staging", cmd: "git add -A", category: "Basics", tags: ["add", "stage", "all"] },
  { name: "Stage specific file", desc: "Stage a single file", cmd: "git add <file>", category: "Basics", tags: ["add", "stage", "file"] },
  { name: "Commit changes", desc: "Commit staged changes with a message", cmd: "git commit -m \"<message>\"", category: "Basics", tags: ["commit", "save"] },
  { name: "Commit all (skip staging)", desc: "Stage and commit in one step", cmd: "git commit -am \"<message>\"", category: "Basics", tags: ["commit", "add", "all"] },
  { name: "Amend last commit", desc: "Modify the last commit message or content", cmd: "git commit --amend -m \"<new message>\"", category: "Basics", tags: ["amend", "fix", "commit"] },
  { name: "View log", desc: "Show commit history", cmd: "git log --oneline --graph", category: "Basics", tags: ["log", "history"] },
  { name: "View diff", desc: "Show unstaged changes", cmd: "git diff", category: "Basics", tags: ["diff", "changes"] },
  { name: "View staged diff", desc: "Show staged changes", cmd: "git diff --staged", category: "Basics", tags: ["diff", "staged"] },
  // Branching
  { name: "List branches", desc: "Show all local branches", cmd: "git branch", category: "Branching", tags: ["branch", "list"] },
  { name: "Create branch", desc: "Create a new branch", cmd: "git branch <name>", category: "Branching", tags: ["branch", "create", "new"] },
  { name: "Switch branch", desc: "Switch to an existing branch", cmd: "git checkout <branch>", category: "Branching", tags: ["checkout", "switch"] },
  { name: "Create & switch", desc: "Create and switch to a new branch", cmd: "git checkout -b <name>", category: "Branching", tags: ["checkout", "branch", "create", "switch"] },
  { name: "Delete branch", desc: "Delete a local branch", cmd: "git branch -d <name>", category: "Branching", tags: ["branch", "delete", "remove"] },
  { name: "Delete remote branch", desc: "Delete a branch from remote", cmd: "git push origin --delete <name>", category: "Branching", tags: ["branch", "delete", "remote"] },
  { name: "Rename branch", desc: "Rename current branch", cmd: "git branch -m <new-name>", category: "Branching", tags: ["branch", "rename"] },
  // Merging
  { name: "Merge branch", desc: "Merge a branch into current", cmd: "git merge <branch>", category: "Merging", tags: ["merge", "combine"] },
  { name: "Merge no fast-forward", desc: "Merge with explicit merge commit", cmd: "git merge --no-ff <branch>", category: "Merging", tags: ["merge", "no-ff"] },
  { name: "Abort merge", desc: "Cancel a merge in progress", cmd: "git merge --abort", category: "Merging", tags: ["merge", "abort", "cancel"] },
  { name: "Cherry-pick commit", desc: "Apply a specific commit to current branch", cmd: "git cherry-pick <commit-hash>", category: "Merging", tags: ["cherry-pick", "commit"] },
  // Remote
  { name: "Add remote", desc: "Add a remote repository", cmd: "git remote add origin <url>", category: "Remote", tags: ["remote", "add", "origin"] },
  { name: "View remotes", desc: "List remote repositories", cmd: "git remote -v", category: "Remote", tags: ["remote", "list"] },
  { name: "Push to remote", desc: "Push commits to remote", cmd: "git push origin <branch>", category: "Remote", tags: ["push", "upload"] },
  { name: "Push & set upstream", desc: "Push and set tracking branch", cmd: "git push -u origin <branch>", category: "Remote", tags: ["push", "upstream", "tracking"] },
  { name: "Pull from remote", desc: "Fetch and merge remote changes", cmd: "git pull origin <branch>", category: "Remote", tags: ["pull", "fetch", "download"] },
  { name: "Fetch all", desc: "Download remote refs without merging", cmd: "git fetch --all", category: "Remote", tags: ["fetch", "download"] },
  // Stash
  { name: "Stash changes", desc: "Save uncommitted changes for later", cmd: "git stash", category: "Stash", tags: ["stash", "save", "temp"] },
  { name: "Stash with message", desc: "Stash with a description", cmd: "git stash push -m \"<message>\"", category: "Stash", tags: ["stash", "save", "message"] },
  { name: "Apply last stash", desc: "Restore last stashed changes", cmd: "git stash pop", category: "Stash", tags: ["stash", "pop", "restore"] },
  { name: "List stashes", desc: "Show all stashed changes", cmd: "git stash list", category: "Stash", tags: ["stash", "list"] },
  { name: "Drop stash", desc: "Delete a stash entry", cmd: "git stash drop", category: "Stash", tags: ["stash", "drop", "delete"] },
  // Undo
  { name: "Unstage file", desc: "Remove file from staging area", cmd: "git reset HEAD <file>", category: "Undo", tags: ["reset", "unstage"] },
  { name: "Discard file changes", desc: "Revert file to last commit", cmd: "git checkout -- <file>", category: "Undo", tags: ["checkout", "discard", "revert"] },
  { name: "Soft reset", desc: "Undo last commit, keep changes staged", cmd: "git reset --soft HEAD~1", category: "Undo", tags: ["reset", "soft", "undo"] },
  { name: "Hard reset", desc: "Undo last commit, discard all changes", cmd: "git reset --hard HEAD~1", category: "Undo", tags: ["reset", "hard", "undo", "discard"] },
  { name: "Revert commit", desc: "Create a new commit that undoes a previous one", cmd: "git revert <commit-hash>", category: "Undo", tags: ["revert", "undo"] },
  // Tags
  { name: "Create tag", desc: "Tag the current commit", cmd: "git tag <name>", category: "Tags", tags: ["tag", "create", "version"] },
  { name: "Create annotated tag", desc: "Tag with a message", cmd: "git tag -a <name> -m \"<message>\"", category: "Tags", tags: ["tag", "annotated", "version"] },
  { name: "Push tags", desc: "Push all tags to remote", cmd: "git push --tags", category: "Tags", tags: ["tag", "push"] },
  // Advanced
  { name: "Interactive rebase", desc: "Rewrite commit history interactively", cmd: "git rebase -i HEAD~<n>", category: "Advanced", tags: ["rebase", "interactive", "squash"] },
  { name: "Bisect start", desc: "Binary search for a bug", cmd: "git bisect start", category: "Advanced", tags: ["bisect", "debug", "bug"] },
  { name: "Clean untracked", desc: "Remove untracked files", cmd: "git clean -fd", category: "Advanced", tags: ["clean", "untracked", "remove"] },
  { name: "Blame file", desc: "Show who changed each line", cmd: "git blame <file>", category: "Advanced", tags: ["blame", "annotate", "who"] },
  { name: "Reflog", desc: "Show reference log (recovery)", cmd: "git reflog", category: "Advanced", tags: ["reflog", "recovery", "history"] },
];

const CATEGORIES = [...new Set(GIT_COMMANDS.map((c) => c.category))];

export default function GitCommandsPage() {
  const { copy, Toast } = useCopyToast();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  const filtered = useMemo(() => {
    return GIT_COMMANDS.filter((c) => {
      const s = search.toLowerCase();
      const matchSearch = !s || c.name.toLowerCase().includes(s) || c.desc.toLowerCase().includes(s) || c.cmd.toLowerCase().includes(s) || c.tags.some((t) => t.includes(s));
      const matchCat = selectedCat === "all" || c.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [search, selectedCat]);

  return (
    <main className="tool-container">
      <h1 className="tool-title">Git Command Reference</h1>
      <p className="tool-desc">Find the right git command for any task. Search by keyword or browse by category.</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search git commands..."
          style={{
            flex: 1, minWidth: 200, background: "var(--surface)", color: "var(--foreground)",
            border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", fontSize: 14,
          }} />
        <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}
          style={{
            background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)",
            borderRadius: 6, padding: "8px 10px", fontSize: 14,
          }}>
          <option value="all">All ({GIT_COMMANDS.length})</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat} ({GIT_COMMANDS.filter((c) => c.category === cat).length})</option>
          ))}
        </select>
      </div>

      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>{filtered.length} command{filtered.length !== 1 ? "s" : ""}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((c, i) => (
          <div key={i} style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
            padding: "10px 14px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>{c.category}</span>
              </div>
              <button className="btn btn-secondary" onClick={() => copy(c.cmd)} style={{ fontSize: 11, padding: "3px 8px" }}>Copy</button>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{c.desc}</div>
            <code style={{
              display: "block", fontSize: 13, fontFamily: "monospace", padding: "6px 10px",
              background: "var(--background)", borderRadius: 4, color: "var(--foreground)",
            }}>{c.cmd}</code>
          </div>
        ))}
      </div>

      <Toast />
    </main>
  );
}
