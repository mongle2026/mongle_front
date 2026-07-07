import { useCallback, useState } from 'react';

import { padding } from '../../../../shared/styles/token';

const DEFAULT_DELETE_BUTTON_HEIGHT = 56;

export default function useCommentDeleteMode({
  screenLayoutHeight,
  windowHeight,
  bottomValue,
  bottomBarHeight,
  isDeletingComment = false,
}) {
  const [activeDeleteComment, setActiveDeleteComment] = useState(null);
  const [commentDeleteTarget, setCommentDeleteTarget] = useState(null);
  const [deleteButtonHeight, setDeleteButtonHeight] = useState(
    DEFAULT_DELETE_BUTTON_HEIGHT
  );

  const isCommentDeleteDialogVisible = !!commentDeleteTarget;

  const openDeleteMode = useCallback(
    (comment, layout, depth = 0) => {
      const isReply = depth === 1;
      const viewportHeight = screenLayoutHeight || windowHeight;

      const bottomBlockedHeight = bottomValue + bottomBarHeight;
      const bottomBlockedTop = viewportHeight - bottomBlockedHeight;

      const bottomButtonTop = layout.y + layout.height;
      const bottomButtonBottom = bottomButtonTop + deleteButtonHeight;

      const placement =
        bottomButtonBottom > bottomBlockedTop ? 'top' : 'bottom';

      setActiveDeleteComment({
        comment,
        placement,

        // 기존 왼쪽 위치 의도 유지
        left: layout.x + (isReply ? 56 : padding.M),

        // container 기준 좌표
        y: layout.y,
        height: layout.height,
      });
    },
    [
      screenLayoutHeight,
      windowHeight,
      bottomValue,
      bottomBarHeight,
      deleteButtonHeight,
    ]
  );

  const closeDeleteMode = useCallback(() => {
    setActiveDeleteComment(null);
  }, []);

  const pressDeleteButton = useCallback(() => {
    if (!activeDeleteComment) {
      return;
    }

    setCommentDeleteTarget(activeDeleteComment.comment);
    setActiveDeleteComment(null);
  }, [activeDeleteComment]);

  const closeDeleteDialog = useCallback(() => {
    if (isDeletingComment) {
      return;
    }

    setCommentDeleteTarget(null);
  }, [isDeletingComment]);

  const clearDeleteTarget = useCallback(() => {
    setCommentDeleteTarget(null);
  }, []);

  const isDeleteModeComment = useCallback(
    (commentId) => {
      return activeDeleteComment?.comment.commentId === commentId;
    },
    [activeDeleteComment]
  );

  return {
    activeDeleteComment,
    commentDeleteTarget,
    isCommentDeleteDialogVisible,
    deleteButtonHeight,

    setDeleteButtonHeight,
    openDeleteMode,
    closeDeleteMode,
    pressDeleteButton,
    closeDeleteDialog,
    clearDeleteTarget,
    isDeleteModeComment,
  };
}