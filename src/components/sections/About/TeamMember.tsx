import { ArrowUpRight } from "lucide-react";

import { LinkedInGlyph } from "./TeamModal";
import type { TeamMember as Member } from "./team.data";

/**
 * A single card in the Team deck — a portrait-led "identity card" rather
 * than the old icon-row list tile. Used for every slot in the stack
 * (TeamOrbit.tsx); `isActive` only changes which affordances render (social
 * icon, founder badge, "view profile" hint, ambient glow) — the surface
 * itself is identical front-to-back so the deck reads as one consistent
 * object.
 */

interface TeamMemberCardProps {
  member: Member;
  isActive: boolean;
}

const TeamMemberCard = ({ member, isActive }: TeamMemberCardProps) => {
  return (
    <div className="group relative h-full w-full">
      {/* Ambient purple glow behind the active card only — the "premium
          depth" cue; kept off the rear cards so it doesn't muddy the stack. */}
      {isActive && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-5 -z-10 rounded-[38px] bg-violet-600/20 blur-2xl"
        />
      )}

      <div
        className={`
          relative h-full w-full overflow-hidden rounded-[26px]
          border bg-[linear-gradient(180deg,rgba(30,22,50,.5)_0%,rgba(9,6,17,.92)_100%)]
          transition-colors duration-500
          ${
            isActive
              ? "border-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_28px_74px_rgba(4,2,12,.58)]"
              : "border-white/[0.07] shadow-[0_14px_38px_rgba(4,2,12,.42)]"
          }
        `}
      >
        {/* Portrait / monogram fill */}
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="absolute inset-0 h-full w-full object-cover object-top"
            draggable={false}
          />
        ) : (
          <>
            <span
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(80% 65% at 50% 30%, rgba(117,73,216,.30), transparent 70%)",
              }}
            />
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center font-['Space_Grotesk'] text-[64px] font-bold tracking-[0.06em] text-violet-100/70"
            >
              {member.initials}
            </span>
          </>
        )}

        {/* Legibility wash so name/role always read over the photo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(6,4,14,.55) 42%, rgba(6,4,14,.95) 100%)",
          }}
        />

        {/* Top hairline, the motif used across every card/panel on the site */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        {/* Leadership badge — text defaults to "Founder" when a member
            doesn't set `leadershipBadge`, so this is byte-identical to
            before for every existing featured member. */}
        {member.featured && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full border border-violet-500/25 bg-violet-500/15 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-violet-200 backdrop-blur-md">
            {member.leadershipBadge ?? "Founder"}
          </span>
        )}

        {/* Social — LinkedIn only, and only when the data actually has one */}
        {isActive && member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.14] bg-black/30 text-white/75 backdrop-blur-md transition-colors duration-300 hover:border-violet-400/40 hover:text-white"
          >
            <LinkedInGlyph size={13} />
          </a>
        )}

        {/* "View profile" hint — active card only. Visible (if subtle) at
            rest rather than opacity-0, since hover alone isn't reachable on
            touch or via keyboard; group-focus-visible reacts to the parent
            card's own focus ring (see TeamOrbit.tsx), not just pointer
            hover. Sized to stay legible over a bright portrait. */}
        {isActive && (
          <span
            aria-hidden
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.16] bg-black/40 text-white/65 backdrop-blur-md transition-all duration-200 ease-out group-hover:scale-110 group-hover:border-violet-400/60 group-hover:bg-black/60 group-hover:text-white group-hover:shadow-[0_0_18px_rgba(164,124,237,.6)] group-focus-visible:scale-110 group-focus-visible:border-violet-400/60 group-focus-visible:bg-black/60 group-focus-visible:text-white group-focus-visible:shadow-[0_0_18px_rgba(164,124,237,.6)]"
            style={{ display: member.linkedin ? "none" : undefined }}
          >
            <ArrowUpRight size={14} strokeWidth={2.2} />
          </span>
        )}

        {/* Identity */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <h3
            className={`
              font-['Space_Grotesk'] font-bold tracking-[-0.02em] text-white
              ${isActive ? "text-[20px] sm:text-[23px]" : "text-[15px] sm:text-[17px]"}
            `}
          >
            {member.name}
          </h3>
          <p
            className={`
              mt-1.5 font-medium uppercase tracking-[0.16em] text-violet-300/85
              ${isActive ? "text-[10.5px] sm:text-[11px]" : "text-[9px] sm:text-[9.5px]"}
            `}
          >
            {member.shortRole}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
