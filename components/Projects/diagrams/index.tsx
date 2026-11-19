/*
 * Maps a project's `diagram` key (set in content.ts) to its SVG component.
 * Projects.tsx looks the active project's diagram up here.
 */

import type { ComponentType } from 'react';
import RepoScout from './RepoScout';
import MiniTensorCompiler from './MiniTensorCompiler';
import AnyLang from './AnyLang';

export type DiagramKey = 'repo-scout' | 'mini-tensor-compiler' | 'anylang';

export const diagrams: Record<DiagramKey, ComponentType> = {
  'repo-scout': RepoScout,
  'mini-tensor-compiler': MiniTensorCompiler,
  anylang: AnyLang,
};
