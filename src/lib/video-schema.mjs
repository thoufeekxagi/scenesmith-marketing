/** Build VideoObject entries only from metadata explicitly supplied by the author. */
export function videoObjectSchema(articleUrl, videos) {
  return videos.flatMap((video, index) => {
    if (!video.uploaded || !video.duration) return [];
    return [{
      "@type": "VideoObject",
      "@id": `${articleUrl}#video-${index + 1}`,
      name: video.title,
      ...(video.description ? {description: video.description} : {}),
      thumbnailUrl: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
      uploadDate: video.uploaded,
      duration: video.duration,
      embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`
    }];
  });
}
