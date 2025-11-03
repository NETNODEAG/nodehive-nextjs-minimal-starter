import { cn } from '@/lib/utils';

export type VideoProps = {
  src: string;
  handleYoutubeShorts?: boolean;
  className?: string;
  options?: {
    background?: number;
    autoplay?: number;
    loop?: number;
    byline?: number;
    title?: number;
  };
  onReady?: () => void;
};

const addYoutubeOptionsToUrl = (
  embedUrl: string,
  options: VideoProps['options'],
  params: URLSearchParams = new URLSearchParams()
) => {
  if (options?.autoplay !== undefined)
    params.append('autoplay', options.autoplay.toString());
  if (options?.loop !== undefined)
    params.append('loop', options.loop.toString());

  // YouTube uses "showinfo" for title display
  if (options?.title !== undefined)
    params.append('showinfo', options.title.toString());

  const queryString = params.toString();
  if (queryString) {
    embedUrl += `?${queryString}`;
  }
  return embedUrl;
};

const addVimeoOptionsToUrl = (
  embedUrl: string,
  options: VideoProps['options'],
  params: URLSearchParams = new URLSearchParams()
) => {
  if (options?.autoplay !== undefined)
    params.append('autoplay', options.autoplay.toString());
  if (options?.loop !== undefined)
    params.append('loop', options.loop.toString());
  if (options?.background !== undefined)
    params.append('background', options.background.toString());
  if (options?.byline !== undefined)
    params.append('byline', options.byline.toString());
  if (options?.title !== undefined)
    params.append('title', options.title.toString());

  const queryString = params.toString();
  if (queryString) {
    embedUrl += `?${queryString}`;
  }
  return embedUrl;
};

const getEmbedUrl = (videoUrl: string, options?: VideoProps['options']) => {
  try {
    const normalizedUrl =
      videoUrl.startsWith('http://') || videoUrl.startsWith('https://')
        ? videoUrl
        : `https://${videoUrl}`;

    const urlObj = new URL(normalizedUrl);
    let embedUrl: string | null = null;

    // YouTube Standard Video (watch?v=XYZ)
    if (
      urlObj.hostname.includes('youtube.com') &&
      urlObj.searchParams.has('v')
    ) {
      embedUrl = `https://www.youtube-nocookie.com/embed/${urlObj.searchParams.get('v')}`;
      embedUrl = addYoutubeOptionsToUrl(embedUrl, options);
      return embedUrl;
    }

    // YouTube Shorts
    if (
      urlObj.hostname.includes('youtube.com') &&
      urlObj.pathname.includes('/shorts/')
    ) {
      embedUrl = videoUrl.replace(
        'youtube.com/shorts/',
        'www.youtube-nocookie.com/embed/'
      );
      embedUrl = addYoutubeOptionsToUrl(embedUrl, options);

      return embedUrl;
    }

    // YouTube Shortened URLs (youtu.be/XYZ)
    if (urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.slice(1);

      embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
      embedUrl = addYoutubeOptionsToUrl(embedUrl, options);

      return embedUrl;
    }

    // Vimeo Video
    if (urlObj.hostname.includes('vimeo.com')) {
      // Extract the video ID from Vimeo URL
      const parts = urlObj.pathname.split('/').filter(Boolean);
      const vimeoId = parts[0]?.match(/^\d+$/) ? parts[0] : null;
      const hash = parts[1]?.match(/^[a-zA-Z0-9]+$/) ? parts[1] : null;
      const params = new URLSearchParams();
      if (hash) {
        params.append('h', hash);
      }
      embedUrl = `https://player.vimeo.com/video/${vimeoId}`;
      embedUrl = addVimeoOptionsToUrl(embedUrl, options, params);
      return embedUrl;
    }

    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error generating embed URL: ${message}`);
    return null;
  }
};

export default function Video({
  src,
  handleYoutubeShorts = false,
  className,
  options,
  onReady,
}: VideoProps) {
  const embedUrl = getEmbedUrl(src, options);
  const isYoutubeShort = src?.includes('youtube.com/shorts/');

  if (!embedUrl) {
    return <p>Unsupported video format</p>;
  }

  if (isYoutubeShort && handleYoutubeShorts) {
    return (
      <div className="flex items-center justify-center bg-slate-50 p-4">
        <div className="relative flex aspect-9/16">
          <iframe
            src={embedUrl}
            title="Embedded Video"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={onReady}
          ></iframe>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative aspect-video w-full', className)}>
      <iframe
        src={embedUrl}
        title="Embedded Video"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={onReady}
      ></iframe>
    </div>
  );
}
