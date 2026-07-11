import React, { useCallback, useRef, useState, useEffect } from 'react';
import { formatDateDetail } from '../../../shared/utils/formatDate';
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View, BackHandler, KeyboardAvoidingView, Platform, Keyboard, useWindowDimensions, } from 'react-native';

import TopNavigation from '../../../shared/components/TopNavigation';
import KebabIcon from '../../../assets/icons/ic_kebab.svg';
import MusicPlay from '../../../shared/components/music/MusicPlay';
import Carousel from '../../../shared/components/Carousel';
import Caption from '../components/Caption';
import AuthorAction from '../components/AuthorAction';
import Menu from '../../../shared/components/Menu';
import Dialog from '../../../shared/components/Dialog';
import BottomBar from './components/BottomBar';
import Comment from './components/Comment';
import Button from '../../../shared/components/Button';
import TrashIcon from '../../../assets/icons/ic_trash.svg';

import { colors } from '../../../shared/styles/color';
import { typo } from '../../../shared/styles/typo';
import { gap, padding } from '../../../shared/styles/token';

import useFeedDetail from './hook/useFeedDetail';
import useCommentDeleteMode from './hook/useCommentDeleteMode';
import useFeedActions from '../home/hook/useFeedActions';
import useFeedComments from './hook/useFeedComments';
import { useFloatingBottomOffset } from '../../write/record/hook/useFloatingBottomOffset';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const DOUBLE_TAP_DELAY = 300;
const DOUBLE_TAP_COOLDOWN = 350;

function TextLines({ content = '' }) {
  const [lines, setLines] = useState([]);
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    setLines([]);
    setMeasured(false);
  }, [content]);

  const onTextLayout = useCallback((e) => {
    if (!measured) {
      setLines(e.nativeEvent.lines);
      setMeasured(true);
    }
  }, [measured]);

  if (!measured) {
    return (
      <Text style={[styles.lineText, { opacity: 0 }]} onTextLayout={onTextLayout}>
        {content}
      </Text>
    );
  }

  return (
    <View style={styles.linesContainer}>
      {lines.map((line, i) => (
        <View key={i} style={styles.lineRow}>
          <Text style={styles.lineText} numberOfLines={1}>
            {line.text.trimEnd()}
          </Text>
          <View style={styles.underline} />
        </View>
      ))}
    </View>
  );
}

export default function FeedDetailScreen({ navigation, route, ...directProps }) {
  const {
    onPressFollow,
  } = { ...directProps, ...(route?.params ?? {}) };
  // 하드코딩
  const userId = 1;
  const { feedId } = route.params;

  const [isFollowing, setFollowing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const screenRef = useRef(null);
  const screenLayoutHeightRef = useRef(0);
  const bottomBarHeightRef = useRef(0);

  const keyboardVisibleRef = useRef(false);

  const bottomValue = useFloatingBottomOffset();
  const { height: windowHeight } = useWindowDimensions();

  const [isTransitionFinished, setTransitionFinished] =
    useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionEnd',
      event => {
        if (!event.data.closing) {
          setTransitionFinished(true);
        }
      }
    );

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const keyboardShowEvent =
      Platform.OS === 'ios'
        ? 'keyboardWillShow'
        : 'keyboardDidShow';

    const showSubscription = Keyboard.addListener(
      keyboardShowEvent,
      () => {
        keyboardVisibleRef.current = true;
      }
    );

    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        keyboardVisibleRef.current = false;
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const getIsKeyboardVisible = useCallback(() => {
    return keyboardVisibleRef.current;
  }, []);

  const {
    comments,
    commentText,
    setCommentText,
    isSubmittingComment,
    replyTarget,
    setReplyTarget,
    isDeletingComment,
    getCommentProfileSource,
    handleCreateComment,
    handleDeleteComment,
  } = useFeedComments({
    feedId,
    userId,
    enabled: isTransitionFinished,
  });

  const {
    activeDeleteComment,
    commentDeleteTarget,
    isCommentDeleteDialogVisible,
    deleteButtonHeight,

    setDeleteButtonHeight,
    openDeleteMode: handleOpenCommentDeleteMode,
    closeDeleteMode: handleCloseCommentDeleteMode,
    pressDeleteButton: handlePressCommentDeleteButton,
    closeDeleteDialog: handleCloseCommentDeleteDialog,
    clearDeleteTarget,
    isDeleteModeComment,
  } = useCommentDeleteMode({
    screenLayoutHeightRef,
    bottomBarHeightRef,
    windowHeight,
    bottomValue,
    isDeletingComment,
  });

  const { feedData: initialFeedData } = route?.params ?? {};

  const {
    feed,
    deleteFeed,
    isDeletingFeed,
  } = useFeedDetail({
    feedId,
    userId,
    initialFeedData,
    enabled: isTransitionFinished,

    onDeleteSuccess: () => {
      setDialogVisible(false);
      navigation.goBack();
    },
  });

  const {
    toggleLike,
    toggleBookmark,
  } = useFeedActions({ userId });

  const handleScreenLayout = useCallback(event => {
    screenLayoutHeightRef.current =
      event.nativeEvent.layout.height;
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogVisible(false);
  }, []);

  const handleDeleteFeed = () => {
    if (isDeletingFeed) {
      return;
    }

    deleteFeed();
  };

  const handleConfirmDeleteComment = useCallback(async () => {
    const isDeleted = await handleDeleteComment(commentDeleteTarget);

    if (isDeleted) {
      clearDeleteTarget();
    }
  }, [
    handleDeleteComment,
    commentDeleteTarget,
    clearDeleteTarget,
  ]);

  useEffect(() => {
    if (dialogVisible || isCommentDeleteDialogVisible) {
      Keyboard.dismiss();
    }
  }, [dialogVisible, isCommentDeleteDialogVisible]);

  const localFeed = feed;

  // 본문 더블탭 → 하트 바운스 + 좋아요 토글 (취소 포함)
  const likeRef = useRef(null);
  const lastTapRef = useRef(0);
  const lastToggleRef = useRef(0);

  const handleContentTap = useCallback(() => {
    const now = Date.now();

    // 방금 토글했으면 OS가 중복 전달한 여분 탭 무시 (like+unlike 상쇄 방지)
    if (now - lastToggleRef.current < DOUBLE_TAP_COOLDOWN) {
      return;
    }

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      lastTapRef.current = 0;
      lastToggleRef.current = now;
      likeRef.current?.bounce();
      toggleLike(localFeed);
    } else {
      lastTapRef.current = now;
    }
  }, [toggleLike, localFeed]);

  useEffect(() => {
    if (!dialogVisible && !isCommentDeleteDialogVisible && !activeDeleteComment) {
      return;
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isCommentDeleteDialogVisible) {
          handleCloseCommentDeleteDialog();
          return true;
        }

        if (activeDeleteComment) {
          handleCloseCommentDeleteMode();
          return true;
        }

        handleCloseDialog();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [
    dialogVisible,
    isCommentDeleteDialogVisible,
    handleCloseDialog,
    handleCloseCommentDeleteDialog,
    activeDeleteComment,
    handleCloseCommentDeleteMode,
  ]);

  // 코드 최적화나 정리할 때, if (!localFeed)부터 const들 정의까지는 여기에 고정할 것
  // 꼭 return 바로 밑에 있어야됩니다 
  if (!localFeed) {
    return null;
  }

  const user = localFeed.user;
  const record = localFeed.record;
  const music = localFeed.music;
  const images = localFeed.files?.filter(f => f.mimeType?.startsWith('image/')).map(f => ({ uri: `${API_BASE_URL}${f.url}` })) ?? [];
  const hasComments = comments.length > 0;

  return (
    <View
      ref={screenRef}
      collapsable={false}
      style={styles.screen}
      onLayout={handleScreenLayout}
    >

      {menuVisible && (
        <Pressable
          style={styles.menuBackdrop}
          onPress={() => setMenuVisible(false)}
        />
      )}

      <View style={styles.topArea}>
        <TopNavigation
          title="기록"
          showTextButton={false}
          onPressBack={() => navigation?.goBack()}
          rightIcon={KebabIcon}
          rightIconColor={colors.fgNeutralWeak}
          onPressRightIcon={() => setMenuVisible(prev => !prev)}
          theme="light"
        />

        {menuVisible && (
          <View style={styles.menuWrapper}>
            <Menu
              onEdit={() => {
                setMenuVisible(false);
                navigation.navigate('RecordEdit', {
                  feedId: localFeed.feedId,
                });
              }}
              onDelete={() => {
                setMenuVisible(false);
                setDialogVisible(true);
              }}
            />
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: bottomValue,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <MusicPlay
          title={music?.musicTitle}
          artist={music?.musicArtist}
          imageSource={music?.musicArtwork ? music?.musicArtwork : undefined}
          audioUri={music?.previewUrl}
        />

        {!!record?.text && (
          <Pressable style={styles.textSection} onPress={handleContentTap}>
            <TextLines content={record?.text} />
          </Pressable>
        )}

        <Carousel images={images} onPressImage={setSelectedImage} />

        <AuthorAction
          name={user.nickname}
          id={user.userCode}
          profileSource={
            user.hasProfileImage && user.profileImageUrl
              ? {
                uri: `${API_BASE_URL}${user.profileImageUrl}`,
              }
              : null
          }
          isFollowing={isFollowing}
          isBookmarked={localFeed.isBookmarked}
          isLiked={localFeed.isLiked}
          likeRef={likeRef}
          onPressFollow={() => {
            setFollowing(value => !value);
            onPressFollow?.();
          }}
          onPressBookmark={() => toggleBookmark(localFeed)}
          onPressLike={() => toggleLike(localFeed)}
        />

        <Caption
          date={localFeed.createdAt ? formatDateDetail(localFeed.createdAt) : ''}
          bookmarkCount={localFeed.bookmarkCount}
          isEdited={localFeed.isEdited}
        />

        {hasComments && (
          <>
            <View style={styles.commentHeader}>
              <Text style={styles.commentHeaderText}>댓글</Text>
            </View>

            <View style={styles.commentList}>
              {comments.map((item) => (
                <View key={item.commentId}>
                  <Comment
                    userCode={item.user?.userCode ?? `user_${item.userId}`}
                    comment={item.content}
                    createdAt={
                      item.createdAt
                        ? formatDateDetail(item.createdAt)
                        : ''
                    }
                    profileImageUrl={getCommentProfileSource(
                      item.user?.profileImageUrl
                    )}
                    depth={0}
                    isDeleteMode={isDeleteModeComment(item.commentId)}
                    measureRelativeToRef={screenRef}
                    isKeyboardVisible={getIsKeyboardVisible}
                    onOpenDeleteMode={(layout) => {
                      handleOpenCommentDeleteMode(item, layout, 0);
                    }}
                    onCloseDeleteMode={handleCloseCommentDeleteMode}
                    onPress={() => {
                      setReplyTarget({
                        commentId: item.commentId,
                        userCode:
                          item.user?.userCode ?? `user_${item.userId}`,
                      });
                    }}
                  />

                  {item.replies?.map((reply) => (
                    <Comment
                      key={reply.commentId}
                      userCode={
                        reply.user?.userCode ?? `user_${reply.userId}`
                      }
                      comment={reply.content}
                      createdAt={
                        reply.createdAt
                          ? formatDateDetail(reply.createdAt)
                          : ''
                      }
                      profileImageUrl={getCommentProfileSource(
                        reply.user?.profileImageUrl
                      )}
                      depth={1}
                      isDeleteMode={isDeleteModeComment(reply.commentId)}
                      measureRelativeToRef={screenRef}
                      isKeyboardVisible={getIsKeyboardVisible}
                      onOpenDeleteMode={(layout) => {
                        handleOpenCommentDeleteMode(reply, layout, 1);
                      }}
                      onCloseDeleteMode={handleCloseCommentDeleteMode}
                      onPress={() => {
                        setReplyTarget({
                          commentId: item.commentId,
                          userCode:
                            item.user?.userCode ?? `user_${item.userId}`,
                        });
                      }}
                    />
                  ))}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {activeDeleteComment && (
        <>
          <Pressable
            style={styles.commentDeleteDim}
            onPress={handleCloseCommentDeleteMode}
          />

          <View
            pointerEvents="box-none"
            onLayout={event => {
              setDeleteButtonHeight(
                event.nativeEvent.layout.height
              );
            }}
            style={[
              styles.commentDeleteButtonWrapper,
              {
                left: activeDeleteComment.left,
                top:
                  activeDeleteComment.placement === 'top'
                    ? activeDeleteComment.y -
                    deleteButtonHeight
                    : activeDeleteComment.y +
                    activeDeleteComment.height,
              },
            ]}
          >
            <Button
              label="삭제하기"
              icon={<TrashIcon width={16} height={16} color='#E4130C' />}
              color="layerDefault"
              text="criticalStrong"
              onPress={handlePressCommentDeleteButton}
              style={styles.shadow}
            />
          </View>
        </>
      )}

      <Modal visible={!!selectedImage} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setSelectedImage(null)}>
        <Pressable style={styles.modalDim} onPress={() => setSelectedImage(null)}>
          <View style={styles.modalImageWrapper}>
            {selectedImage && (
              <Image
                source={typeof selectedImage === 'string' ? { uri: selectedImage } : selectedImage}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Pressable>
      </Modal>

      <View
        style={{ bottom: bottomValue }}
        onLayout={event => {
          bottomBarHeightRef.current =
            event.nativeEvent.layout.height;
        }}
      >
        <BottomBar
          value={commentText}
          onChangeText={setCommentText}
          onSubmit={handleCreateComment}
          disabled={!commentText.trim() || isSubmittingComment}
          maxLength={400}
          placeholder={
            replyTarget
              ? `@${replyTarget.userCode}에게 답글 작성`
              : '이 글에 대한 생각을 작성해 주세요.'
          }
        />
      </View>

      {dialogVisible && (
        <View style={styles.dim}>
          <Dialog
            title='글을 영구 삭제할까요?'
            description='삭제한 글은 다시 되돌릴 수 없습니다.'
            cancelLabel='취소'
            confirmLabel='삭제'
            onCancel={handleCloseDialog}
            onConfirm={handleDeleteFeed}
          />
        </View>
      )}

      {isCommentDeleteDialogVisible && (
        <View style={styles.dimWeak}>
          <Dialog
            title="댓글을 영구 삭제할까요?"
            description="삭제한 댓글은 다시 되돌릴 수 없습니다."
            cancelLabel="취소"
            confirmLabel="삭제"
            onCancel={handleCloseCommentDeleteDialog}
            onConfirm={handleConfirmDeleteComment}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgLayerDefault,
  },
  topArea: {
    zIndex: 20,
    elevation: 20,
  },
  menuWrapper: {
    position: 'absolute',
    top: '100%',
    right: 18,
    zIndex: 30,
    elevation: 30,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: padding.XL,
  },
  textSection: {
    paddingHorizontal: padding.L,
    paddingVertical: padding.M,
  },
  linesContainer: {
    alignSelf: 'stretch',
    gap: gap.M,
  },
  lineRow: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    gap: gap.XS,
  },
  lineText: {
    alignSelf: 'stretch',
    textAlign: 'justify',
    ...typo.bodyMedium,
    color: colors.fgLayerNeutral,
  },
  underline: {
    height: 1,
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderColor: colors.strokeNeutralWeak,
  },
  commentHeader: {
    width: '100%',
    paddingVertical: padding.M,
    paddingHorizontal: padding.XL,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgLayerDefault,
  },
  commentHeaderText: {
    ...typo.labelMedium,
    color: colors.fgLayerNeutral,
  },
  commentList: {
    width: '100%',
  },
  modalDim: {
    flex: 1,
    backgroundColor: colors.bgDim,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageWrapper: {
    width: Dimensions.get('window').width - padding.XL * 2,
    aspectRatio: 1,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgDim,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 999,
  },
  dimWeak: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgDimWeak,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 999,
  },
  commentDeleteDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgDimWeak,
    zIndex: 999,
    elevation: 999,
  },

  commentDeleteButtonWrapper: {
    position: 'absolute',
    zIndex: 1000,
    elevation: 1000,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
});
