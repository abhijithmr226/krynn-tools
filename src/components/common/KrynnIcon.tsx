/**
 * KrynnIcon — maps icon name strings (from tools.ts) to @phosphor-icons/react.
 * Skill: ui-ux-pro-max recommends @phosphor-icons/react as the primary icon set.
 * Weight "duotone" for tool/category chips, "bold" for nav elements.
 */
"use client";

import type { Icon, IconWeight } from "@phosphor-icons/react";
import {
  // ── File / Document ───────────────────────────────────────────
  FilePdf,
  FileText,
  FileArrowDown,
  FileArrowUp,
  FilePlus,
  FileCode,
  FileImage,
  Files,
  FileMinus,
  // ── Action ───────────────────────────────────────────────────
  Scissors,
  ArrowsClockwise,
  ArrowCounterClockwise,
  Trash,
  Lock,
  LockOpen,
  LockSimple,
  // ── Table / Office ────────────────────────────────────────────
  Table,
  Presentation,
  Image,
  Images,
  Scan,
  // ── Image editing ─────────────────────────────────────────────
  ArrowsIn,
  ArrowsOut,
  Crop,
  FlipHorizontal,
  ArrowsLeftRight,
  Recycle,
  Eraser,
  Drop,
  Crosshair,
  Eyedropper,
  // ── Text ─────────────────────────────────────────────────────
  Hash,
  AlignLeft,
  TextT,
  ListDashes,
  ArrowsDownUp,
  ArrowsVertical,
  ListBullets,
  Link,
  Shuffle,
  GitFork,
  Code,
  // ── Dev ──────────────────────────────────────────────────────
  Terminal,
  Key,
  QrCode,
  Barcode,
  Database,
  Globe,
  BracketsCurly,
  Ticket,
  // ── Design ───────────────────────────────────────────────────
  Palette,
  PaintBucket,
  SquaresFour,
  Rainbow,
  Waves,
  Play,
  PaintBrush,
  // ── Calculator ───────────────────────────────────────────────
  Calculator,
  Heart,
  CalendarBlank,
  Percent,
  Money,
  Scales,
  Thermometer,
  Tag,
  Receipt,
  TrendUp,
  Bank,
  // ── Security ─────────────────────────────────────────────────
  Shield,
  Password,
  Fingerprint,
  Siren,
  // ── Misc ─────────────────────────────────────────────────────
  DiceFive,
  Coin,
  // ── Social Media ──────────────────────────────────────────────
  ShareNetwork,
  TextAa,
  // ── Navigation & UI ──────────────────────────────────────────
  House,
  MagnifyingGlass,
  Sun,
  Moon,
  List,
  Lightning,
  Star,
  CheckCircle,
  CaretDown,
  CaretRight,
  DeviceMobile,
  X,
  Warning,
  Info,
  Sparkle,
  ArrowRight,
  Download,
  UploadSimple,
  SquaresFour as GridFour,
} from "@phosphor-icons/react";

export type { IconWeight };

interface KrynnIconProps {
  name: string;
  size?: number;
  weight?: IconWeight;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Maps tools.ts icon name strings → verified Phosphor components */
const ICON_MAP: Record<string, Icon> = {
  // ── PDF Tools ────────────────────────────────────────────────
  FilePdf,
  FileText,
  FileDown:    FileArrowDown,
  FileType:    FileArrowUp,
  FilePlus,
  Merge:       Files,
  Scissors,
  RotateCw:    ArrowsClockwise,
  RotateCcw:   ArrowCounterClockwise,
  Trash2:      Trash,
  Shield,
  Unlock:      LockOpen,
  Lock:        LockSimple,
  Image,
  FileImage,
  Table,
  Presentation,
  Images,
  ScanText:    Scan,

  // ── Image Tools ──────────────────────────────────────────────
  Minimize2:       ArrowsIn,
  Maximize2:       ArrowsOut,
  Crop,
  FlipHorizontal,
  ArrowRightLeft:  ArrowsLeftRight,
  RefreshCw:       Recycle,
  Eraser,
  Circle:          Drop,
  Focus:           Crosshair,
  Droplets:        Drop,
  Type:            TextT,
  Pipette:         Eyedropper,
  SvgToImg:        Image,

  // ── Text Tools ───────────────────────────────────────────────
  Hash,
  Alphabet:        TextT,
  CaseSensitive:   TextT,
  ListMinus:       ListDashes,
  ArrowUpDown:     ArrowsDownUp,
  Space:           ArrowsVertical,
  ListOrdered:     ListBullets,
  Link,
  AlignLeft,
  Shuffle,
  GitCompare:      GitFork,
  Code,
  CodeXml:         Code,
  FileTextOutline: FileText,
  Eye:             Scan,

  // ── Developer Tools ──────────────────────────────────────────
  FileCode,
  Globe,
  Database,
  Terminal,
  Key,
  QrCode,
  Barcode,
  Bug:             Terminal,
  History:         ArrowCounterClockwise,
  Braces:          BracketsCurly,
  JsonFormat:      BracketsCurly,
  JsonValid:       CheckCircle,
  JsonToCsv:       Table,
  CsvToJson:       BracketsCurly,
  XmlFormat:       FileCode,
  Base64:          Lock,
  UrlCode:         Globe,
  Regex:           Terminal,
  Uuid:            Fingerprint,
  Hash2:           Key,
  Jwt:             Ticket,
  Ticket,
  SqlFormat:       Database,
  CssMin:          FileMinus,
  FileMinus,
  Minimize:        FileMinus,

  // ── Web Design ───────────────────────────────────────────────
  Palette,
  PaintBucket,
  Gradient:        Rainbow,
  SquaresFour,
  Eyedropper,
  Rainbow,
  Waves,
  Play,
  PaintBrush,
  Paintbrush:      PaintBrush,

  // ── Calculators ──────────────────────────────────────────────
  Calculator,
  Heart,
  Calendar:        CalendarBlank,
  CalendarBlank,
  Percent,
  Money,
  Scales,
  Thermometer,
  CurrencyDollar:  Money,
  Tag,
  Receipt,
  TrendUp,
  TrendingUp:      TrendUp,
  Bank,
  Landmark:        Bank,
  DollarSign:      Money,

  // ── Security ─────────────────────────────────────────────────
  Password,
  Fingerprint,
  Siren,

  // ── Misc ─────────────────────────────────────────────────────
  Dice:            DiceFive,
  DiceFive,
  Coin,
  Sparkles:        Sparkle,
  SortAscending:   ArrowsDownUp,
  TextAlignLeft:   AlignLeft,

  // ── Social Media ──────────────────────────────────────────────
  ShareNetwork,
  TextAa,

  // ── Navigation ───────────────────────────────────────────────
  House,
  Search:          MagnifyingGlass,
  MagnifyingGlass,
  Sun,
  Moon,
  Menu:            List,
  GridFour,
  X,
  CaretDown,
  CaretRight,
  Lightning,
  Star,
  CheckCircle,
  DeviceMobile,
  Warning,
  Info,
  Sparkle,
  ArrowRight,
  Download,
  UploadSimple,

  // ── Aliases for tools.ts icon names ──────────────────────────
  FileText2:   FileText,
  ImageIcon:   Image,
  Lock2:       LockSimple,
};

export default function KrynnIcon({ name, size = 22, weight = "duotone", color, className, style }: KrynnIconProps) {
  const IconComp = ICON_MAP[name] ?? Lightning;
  return <IconComp size={size} weight={weight} color={color} className={className} style={style} />;
}

/* Re-export commonly used icons for direct use in Header/Footer/page */
export {
  House, MagnifyingGlass, Sun, Moon, List,
  Lightning, Star, CheckCircle, CaretDown, CaretRight,
  DeviceMobile, X, LockSimple, Lock, Warning, Info,
  ArrowCounterClockwise, Sparkle, ArrowRight, Download, UploadSimple,
};
