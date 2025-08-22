import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

interface ThumbnailProps {
  url: string | undefined | null
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative my-2 max-w-[360px] cursor-zoom-in overflow-hidden rounded-lg border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Message image"
            className="size-full rounded-md object-cover"
          />
        </div>
      </DialogTrigger>

      <DialogContent
        isThumbnail
        className="max-w-[800px] border-none bg-transparent p-0 shadow-none"
      >
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Message image</DialogTitle>
            <DialogDescription>Your message image</DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="Message image"
          className="size-full rounded-md object-cover"
        />
      </DialogContent>
    </Dialog>
  )
}
