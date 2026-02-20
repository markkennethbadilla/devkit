"use client";
import { useState, useMemo, useCallback } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const ROLES = ["Owner", "Group", "Others"] as const;
const PERMS = ["Read", "Write", "Execute"] as const;
const PERM_BITS = [4, 2, 1] as const;

const COMMON_PERMS = [
  { octal: "755", desc: "Owner rwx, group/others rx" },
  { octal: "644", desc: "Owner rw, group/others r" },
  { octal: "777", desc: "Full permissions for all" },
  { octal: "700", desc: "Owner only, full access" },
  { octal: "600", desc: "Owner rw only" },
  { octal: "750", desc: "Owner rwx, group rx" },
  { octal: "444", desc: "Read-only for all" },
  { octal: "666", desc: "Read/write for all" },
];

function octalToPerms(octal: string): boolean[][] {
  const perms = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ];
  if (octal.length !== 3) return perms;
  for (let r = 0; r < 3; r++) {
    const val = parseInt(octal[r]);
    if (isNaN(val)) continue;
    perms[r][0] = (val & 4) !== 0;
    perms[r][1] = (val & 2) !== 0;
    perms[r][2] = (val & 1) !== 0;
  }
  return perms;
}

function permsToOctal(perms: boolean[][]): string {
  return perms
    .map((role) =>
      role.reduce((sum, perm, i) => sum + (perm ? PERM_BITS[i] : 0), 0)
    )
    .join("");
}

function permsToSymbolic(perms: boolean[][]): string {
  return perms
    .map((role) =>
      [
        role[0] ? "r" : "-",
        role[1] ? "w" : "-",
        role[2] ? "x" : "-",
      ].join("")
    )
    .join("");
}

export default function ChmodCalculator() {
  const [perms, setPerms] = useState<boolean[][]>(() =>
    octalToPerms("755")
  );
  const [octalInput, setOctalInput] = useState("755");
  const { copy, Toast } = useCopyToast();

  const octal = useMemo(() => permsToOctal(perms), [perms]);
  const symbolic = useMemo(() => permsToSymbolic(perms), [perms]);

  const togglePerm = useCallback(
    (role: number, perm: number) => {
      setPerms((prev) => {
        const next = prev.map((r) => [...r]);
        next[role][perm] = !next[role][perm];
        setOctalInput(permsToOctal(next));
        return next;
      });
    },
    []
  );

  const setFromOctal = useCallback((val: string) => {
    setOctalInput(val);
    if (/^[0-7]{3}$/.test(val)) {
      setPerms(octalToPerms(val));
    }
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Chmod Calculator</h1>
      <p className="text-[var(--muted)] mb-6">
        Calculate Unix/Linux file permissions. Toggle checkboxes or enter a
        numeric value. Click outputs to copy.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div
          onClick={() => copy(octal)}
          className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors cursor-pointer"
        >
          <div className="text-xs text-[var(--muted)] mb-1">Numeric</div>
          <div className="font-mono text-3xl">{octal}</div>
        </div>
        <div
          onClick={() => copy(symbolic)}
          className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors cursor-pointer"
        >
          <div className="text-xs text-[var(--muted)] mb-1">Symbolic</div>
          <div className="font-mono text-3xl">{symbolic}</div>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm text-[var(--muted)] mb-1 block">
          Enter octal value:
        </label>
        <input
          type="text"
          value={octalInput}
          onChange={(e) => setFromOctal(e.target.value)}
          maxLength={3}
          className="font-mono w-24 text-center text-lg"
          placeholder="755"
        />
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 text-[var(--muted)] font-medium">
                Role
              </th>
              {PERMS.map((p) => (
                <th
                  key={p}
                  className="text-center py-2 px-3 text-[var(--muted)] font-medium"
                >
                  {p}
                </th>
              ))}
              <th className="text-center py-2 px-3 text-[var(--muted)] font-medium">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {ROLES.map((role, ri) => (
              <tr key={role} className="border-t border-[var(--border)]">
                <td className="py-3 px-3 font-medium">{role}</td>
                {PERMS.map((_, pi) => (
                  <td key={pi} className="text-center py-3 px-3">
                    <input
                      type="checkbox"
                      checked={perms[ri][pi]}
                      onChange={() => togglePerm(ri, pi)}
                      className="w-5 h-5 accent-[var(--accent)] cursor-pointer"
                    />
                  </td>
                ))}
                <td className="text-center py-3 px-3 font-mono">
                  {perms[ri].reduce(
                    (sum, p, i) => sum + (p ? PERM_BITS[i] : 0),
                    0
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        onClick={() => copy(`chmod ${octal} filename`)}
        className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors cursor-pointer mb-6"
      >
        <div className="text-xs text-[var(--muted)] mb-1">Command</div>
        <div className="font-mono text-sm">chmod {octal} filename</div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-2 text-[var(--muted)]">
          Common Permissions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {COMMON_PERMS.map((p) => (
            <button
              key={p.octal}
              onClick={() => setFromOctal(p.octal)}
              className="text-left p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors cursor-pointer"
            >
              <div className="font-mono text-sm text-[var(--accent)]">
                {p.octal}
              </div>
              <div className="text-xs text-[var(--muted)]">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <Toast />
    </div>
  );
}
