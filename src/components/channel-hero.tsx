import { format } from 'date-fns'

interface ChannelHeroProps {
  name: string
  creationTime: number
}

export const ChannelHero = ({ name, creationTime }: ChannelHeroProps) => {
  return (
    <div className="mx-5 mt-[88px] mb-4">
      <p className="mb-2 flex items-center text-2xl font-bold"># {name}</p>

      <p className="mb-4 text-base font-normal text-slate-800">
        This channel was created on{' '}
        {format(new Date(creationTime), 'MMMM do, yyyy')}. This is the very
        beginning fo the <strong>{name}</strong> channel.
      </p>
    </div>
  )
}
