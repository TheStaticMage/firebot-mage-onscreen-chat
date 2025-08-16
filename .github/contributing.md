# Contribution Guidelines

## Welcome

Thank you for your interest in contributing.

This repository does not require you to create an issue or get prior approval. You may submit a Pull Request at any time. In fact, I encourage you to do this without filing an issue if it's just a minor change, e.g. fixing a typo in the documentation.

However, if you're considering significant changes or something that would take you a considerable amount of time, I would _strongly encourage_ you to ask in advance. You can open a GitHub issue to do this. I would really feel bad if I had to reject a contribution that you spent a bunch of time on because it is not consistent with the vision or roadmap of this project.

## Development Guide

- Any code that you submit needs to pass the linter (ESLint).
- Please update any documentation (see the [doc](/doc) directory) as necessary.

## Branches

The `main` branch is considered stable. It is the branch against which all Pull Requests should be targeted. Releases are occasionally cut from this branch as well.

Please ensure that your branch has been brought up-to-date with `main` when you start your work, and keep it up-to-date as you go along. I wouldn't want you to have to spend a bunch of time resolving merge conflicts because you targeted an old version of the `main` branch.

There is no specific formatting requirement for commit messages. Please use a descriptive phrase indicating what you did. Commits will be squashed upon merge.

## Pull Requests

- Please use the provided Pull Request template. I may close any PRs that do not use the template or are missing necessary sections.
- When you are ready for a review, on your PR under "Reviewers" add TheStaticMage.

### Title

There is no specific formatting requirement for the title of your PR. Please provide a brief phrase or sentence indicating what change you have made.

### Description

This section is required. Please describe what you changed or added. Please detail the change as much as possible, including any new, changed, and removed functionality.

### Motivation

This section is required. Please indicate why you are making the change. In this section you may include links to any relevant GitHub issues or Discord threads.

### Testing

This section is required. Please describe how you have tested your changes. You may include screenshots if it helps.

Please make your best effort to test that your changes work and do not break existing functionality.
