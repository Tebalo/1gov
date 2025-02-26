// data.ts
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
  Hourglass,
  ClipboardCheck,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  ChevronsRight,
  Check,
  UserCog,
  ThumbsUp as RecommendApproval,
  ThumbsDown as RecommendReject,
} from "lucide-react"

export const labels = [
  {
    value: "Teacher",
    label: "Teacher",
  },
  {
    value: "Head Teacher",
    label: "Head Teacher",
  },
  {
    value: "Support Staff",
    label: "Support Staff",
  },
  {
    value: "Administrator",
    label: "Administrator",
  },
]

export const statuses = [
  {
    value: "Pending-Screening",
    label: "Pending Screening",
    icon: Hourglass,
  },
  {
    value: "Pending-Assessment",
    label: "Pending Assessment",
    icon: ClipboardCheck,
  },
  {
    value: "Manager-Approved",
    label: "Manager Approved",
    icon: ThumbsUp,
  },
  {
    value: "Manager-Rejected",
    label: "Manager Rejected",
    icon: ThumbsDown,
  },
  {
    value: "Pending-Customer-Action",
    label: "Pending Customer Action",
    icon: UserCog,
  },
  {
    value: "Recommended-For-Approval",
    label: "Recommended For Approval",
    icon: RecommendApproval,
  },
  {
    value: "Recommended-For-Rejection",
    label: "Recommended For Rejection",
    icon: RecommendReject,
  },
]

export const endorsementStatuses = [
  {
    value: "Endorsement-Complete",
    label: "Endorsement Complete",
    icon: Check,
    variant: "success",
  },
  {
    value: "Pending-Endorsement",
    label: "Pending Endorsement",
    icon: AlertCircle,
    variant: "secondary",
  },
  {
    value: "Recommended-For-Endorsement",
    label: "Recommended For Endorsement",
    icon: ChevronsRight,
    variant: "outline",
  },
]

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
]