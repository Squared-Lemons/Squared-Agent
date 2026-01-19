
I have goal of **teaching good habits from day one** (especially to beginners or people new to agents), while still being powerful for experienced users.  

The structure enforces **branch discipline** as a core safety & organization principle — something many developers learn the hard way after years of mistakes.

### Your Desired Workflow – Summarized & Confirmed

1. **Open Claude Terminal**  
   → Run `claude` (the Anthropic CLI agent tool) in your project directory

2. **/start-session**  
   → Optional but recommended entry point  
   → Could: sync main/develop, show current status, create/load a session note (e.g. TASK.md), remind user about branch discipline  
   → Sets the "session mindset"

3. **Do the session work**  
   → Chat with Claude normally  
   → Make plans, ask questions, request code changes  
   → **Key enforcement rule** (the teaching part):  
     If you ask Claude to **edit/create/delete files** (or run git commands that modify code) **and you're still on main/develop or a protected branch**, Claude **stops immediately** and responds with something like:

     ```
     STOPPED: You're on the main branch (or protected branch). 
     Direct code changes here are not allowed to keep the codebase safe.

     To start safe work:
     → Use /new-feature "short-description"   (recommended)
     → Or manually: git checkout -b feature/your-name

     Once on a feature branch, you can ask me to make changes.
     ```

     This is the **muscle-memory builder** — it gently but firmly teaches "never work directly on main".

4. **/new-feature "payment-redesign"** (optional but encouraged)  
   → Claude does the heavy lifting:  
     - Suggests/creates a good branch name (e.g. `feature/payment-redesign` or `jonogill/payment-redesign-2026-01`)  
     - Runs `git checkout -b ...` (or creates worktree if configured for parallel)  
     - Optionally: creates a worktree instead of plain branch (e.g. `git worktree add ../trees/payment-redesign feature/payment-redesign`)  
     - cd into it automatically (or instructs user)  
     - Starts fresh session context about the feature  
     - Reminds: "Now we're safe — feel free to ask for code changes"

5. **Work happens** (code changes, commits, tests, etc.)  
   → All changes stay isolated on the branch  
   → Frequent commits encouraged (manual or via Claude: "commit this progress")

6. **End Session** — `/end-session` or `/complete-feature`  
   → Options depending on state:  
     - `/complete-feature` → review diff, suggest squash/reword commits, push branch, offer to create PR, then optionally clean up branch/worktree  
     - `/create-pull-request` → standalone: draft PR title/body, push if needed, open browser to GitHub PR page (or use gh cli if installed)  
     - Clean reminder: "Good work! Branch is pushed. Ready to delete worktree/branch when PR is merged?"

### Why This Teaches So Well (and scales as user matures)

- **Beginners** get hard stops + clear guidance → "Oh, I see — I need to be on a branch first" becomes instinct very quickly  
- **Intermediate** users start using `/new-feature` naturally → muscle memory for isolation  
- **Advanced** users can ignore/skip the guards, or even customize them later (e.g. allow direct work on personal forks, add worktree mode toggle, etc.)  
- The commands feel **conversational** (/start-session, /new-feature) which matches how people talk to Claude anyway

### How to Actually Implement This Today (January 2026)

Claude Code supports **custom slash commands** very well — you put markdown files in `~/.claude/commands/` (global) or `.claude/commands/` (per-project).

You can make these exact commands:

- `/start-session.md`
- `/new-feature.md` (use `$ARGUMENTS` placeholder for the description)
- `/complete-feature.md`
- `/create-pull-request.md`

Inside each .md file, write natural instructions telling Claude exactly how to behave, including the branch check logic.

Example skeleton for the enforcement (put this in many commands or in CLAUDE.md):

```
Before any file edit, git commit, or code generation:
1. Run git status or git branch --show-current
2. If current branch is main, master, develop, release/* or similar protected name:
   - Do NOT make any changes
   - Politely explain the rule
   - Suggest /new-feature "$ARGUMENTS" or manual branch creation
   - Stop execution
3. Otherwise: proceed normally
```

Many people already do similar enforcement via **hooks** (PreToolUse hook) or by putting strong instructions in CLAUDE.md at repo root.

If you want parallel agents later → upgrade `/new-feature` to create worktrees (very common pattern with Claude Code in 2025–2026).

This is an excellent, principled way to structure things — especially for teaching.  

If you'd like, I can help draft sample content for those .md command files, or suggest exact wording for the branch guard messages that feel friendly yet firm. Just let me know how strict vs gentle you want the tone for beginners! 🚀