'use client';

import Link from 'next/link';
import { ChevronDown, Play } from 'lucide-react';
import { Chapter } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface EpisodeAccordionProps {
  chapters: Chapter[];
}

// Group episodes into chunks of 10
function groupEpisodes(chapters: Chapter[]): { label: string; episodes: Chapter[] }[] {
  const groups: { label: string; episodes: Chapter[] }[] = [];
  const chunkSize = 10;
  
  for (let i = 0; i < chapters.length; i += chunkSize) {
    const chunk = chapters.slice(i, i + chunkSize);
    const start = i + 1;
    const end = Math.min(i + chunkSize, chapters.length);
    groups.push({
      label: `Episode ${start} - ${end}`,
      episodes: chunk,
    });
  }
  
  return groups;
}

export function EpisodeAccordion({ chapters }: EpisodeAccordionProps) {
  // Single episode or movie - no accordion needed
  if (chapters.length <= 1) {
    return (
      <div className="space-y-2">
        {chapters.map((chapter, index) => (
          <EpisodeCard key={chapter.chapterUrlId} chapter={chapter} index={index} />
        ))}
      </div>
    );
  }

  // Less than 10 episodes - show all without accordion
  if (chapters.length <= 10) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {chapters.map((chapter, index) => (
          <EpisodeCard key={chapter.chapterUrlId} chapter={chapter} index={index} />
        ))}
      </div>
    );
  }

  // Group episodes for accordion
  const groups = groupEpisodes(chapters);

  return (
    <Accordion type="single" collapsible defaultValue="group-0" className="space-y-2">
      {groups.map((group, groupIndex) => (
        <AccordionItem 
          key={groupIndex} 
          value={`group-${groupIndex}`}
          className="border border-border rounded-lg overflow-hidden bg-card"
        >
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <span className="font-medium">{group.label}</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {group.episodes.map((chapter, index) => (
                <EpisodeCard 
                  key={chapter.chapterUrlId} 
                  chapter={chapter} 
                  index={groupIndex * 10 + index} 
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// Individual episode card
function EpisodeCard({ chapter, index }: { chapter: Chapter; index: number }) {
  return (
    <Link href={`/watch/${chapter.chapterUrlId}`} className="group">
      <div className="p-3 rounded-lg bg-card border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
            {chapter.title || `Episode ${index + 1}`}
          </p>
          {chapter.date && (
            <p className="text-xs text-muted-foreground">{chapter.date}</p>
          )}
        </div>
        <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
      </div>
    </Link>
  );
}
