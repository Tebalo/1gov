import {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CheckCircledIcon,
    CircleIcon,
    CrossCircledIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon,
  } from "@radix-ui/react-icons"
  
  export const labels = [
    {
      value: "Bar",
      label: "Bar",
    },
    {
      value: "Investigate",
      label: "Investigate",
    },
    {
      value: "Approve",
      label: "Approve",
    },
  ]
  
  export const statuses = [
    {
      value: "Pending-Review",
      label: "Pending-Review",
      icon: QuestionMarkCircledIcon,
    },
    {
      value: "Pending-Screening",
      label: "Pending-Screening",
      icon: CircleIcon,
    },
    {
      value: "Pending-SRO-Review",
      label: "Pending-SRO-Review",
      icon: StopwatchIcon,
    },
    {
      value: "Pending-Manager-Review",
      label: "Pending-Manager-Review",
      icon: CheckCircledIcon,
    },
    {
      value: "Pending-Director-Review",
      label: "Pending-Director-Review",
      icon: CrossCircledIcon,
    },
  ]
  
  export const priorities = [
    {
      label: "Low",
      value: "low",
      icon: ArrowDownIcon,
    },
    {
      label: "Medium",
      value: "medium",
      icon: ArrowRightIcon,
    },
    {
      label: "High",
      value: "high",
      icon: ArrowUpIcon,
    },
  ]
  