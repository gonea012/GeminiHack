interface Props {
  npcName: string;
  line: string;
  avatarSrc?: string;
}

export function NPCBubble({ npcName, line, avatarSrc }: Props) {
  return (
    <div className="flex items-end gap-2">
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt={npcName}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-gray-600"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 text-lg">
          👤
        </div>
      )}
      <div className="flex flex-col items-start gap-1">
        <span className="text-xs text-gray-400 ml-1">{npcName}</span>
        <div className="bg-white text-gray-900 rounded-2xl rounded-tl-none px-4 py-3 max-w-xs shadow text-base leading-snug">
          {line}
        </div>
      </div>
    </div>
  );
}
