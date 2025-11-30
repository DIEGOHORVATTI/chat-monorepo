type Props = Partial<{
  days: number
  hours: number
  minutes: number
  seconds: number
}>

export default function timerToSeconds({
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
}: Props): number {
  const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds

  return totalSeconds
}
