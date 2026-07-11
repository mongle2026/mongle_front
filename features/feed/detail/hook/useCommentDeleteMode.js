import { useCallback, useState } from 'react';

import { padding } from '../../../../shared/styles/token';

const DEFAULT_DELETE_BUTTON_HEIGHT = 56;

export default function useCommentDeleteMode({
  screenLayoutHeightRef,
  bottomBarHeightRef,
  windowHeight,
  bottomValue,
  isDeletingComment = false,
}) {
  const [activeDeleteComment, setActiveDeleteComment] =
    useState(null);

  const [commentDeleteTarget, setCommentDeleteTarget] =
    useState(null);

  const [deleteButtonHeight, setDeleteButtonHeight] =
    useState(DEFAULT_DELETE_BUTTON_HEIGHT);

  const isCommentDeleteDialogVisible =
    !!commentDeleteTarget;

  const openDeleteMode = useCallback(
    (comment, layout, depth = 0) => {
      const isReply = depth === 1;

      const screenLayoutHeight =
        screenLayoutHeightRef.current;

      const bottomBarHeight =
        bottomBarHeightRef.current;

      const viewportHeight =
        screenLayoutHeight || windowHeight;

      const bottomBlockedHeight =
        bottomValue + bottomBarHeight;

      const bottomBlockedTop =
        viewportHeight - bottomBlockedHeight;

      const bottomButtonTop =
        layout.y + layout.height;

      const bottomButtonBottom =
        bottomButtonTop + deleteButtonHeight;

      const placement =
        bottomButtonBottom > bottomBlockedTop
          ? 'top'
          : 'bottom';

      setActiveDeleteComment({
        comment,
        placement,
        left:
          layout.x +
          (isReply ? 56 : padding.M),
        y: layout.y,
        height: layout.height,
      });
    },
    [
      screenLayoutHeightRef,
      bottomBarHeightRef,
      windowHeight,
      bottomValue,
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

    setCommentDeleteTarget(
      activeDeleteComment.comment
    );

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
    commentId =>
      activeDeleteComment?.comment.commentId ===
      commentId,
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