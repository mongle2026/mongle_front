import React, { useCallback, useRef, useState, useEffect } from 'react';
import { formatDateDetail } from '../../../shared/utils/formatDate';
import { Alert, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View, BackHandler, KeyboardAvoidingView, Platform, Keyboard, } from 'react-native';
import axios from 'axios';

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

import { colors } from '../../../shared/styles/color';
import { typo } from '../../../shared/styles/typo';
import { gap, padding } from '../../../shared/styles/token';

import useFeedDetail from './hook/useFeedDetail';
import useFeedActions from '../home/hook/useFeedActions';
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

  const [comments, setComments] = useState([]);                           // 댓글 모음들
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');                     // 내가 작성 중인 댓글 text
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);

  const [commentDeleteTarget, setCommentDeleteTarget] = useState(null);
  const isCommentDeleteDialogVisible = !!commentDeleteTarget;
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  const bottomValue = useFloatingBottomOffset();
  // const [bottomBarHeight, setBottomBarHeight] = useState(0);

  const { feedData: initialFeedData } = route?.params ?? {};

  const {
    feed,
    deleteFeed,
    isDeletingFeed,
  } = useFeedDetail({
    feedId,
    userId,
    initialFeedData,
    onDeleteSuccess: () => {
      setDialogVisible(false);
      navigation.goBack();
    },
  });

  const {
    toggleLike,
    toggleBookmark,
  } = useFeedActions({ userId });

  const handleCloseDialog = useCallback(() => {
    setDialogVisible(false);
  }, []);

  const handleDeleteFeed = () => {
    if (isDeletingFeed) {
      return;
    }

    deleteFeed();
  };

  const handleOpenCommentDeleteDialog = useCallback((comment) => {
    setCommentDeleteTarget(comment);
  }, []);

  const handleCloseCommentDeleteDialog = useCallback(() => {
    if (isDeletingComment) {
      return;
    }

    setCommentDeleteTarget(null);
  }, [isDeletingComment]);

  const getCommentProfileSource = useCallback((profileImageUrl) => {
    if (!profileImageUrl) {
      return null;
    }

    if (profileImageUrl.startsWith('http')) {
      return { uri: profileImageUrl };
    }

    return { uri: `${API_BASE_URL}${profileImageUrl}` };
  }, []);

  const getComments = useCallback(async () => {
    if (!feedId || !userId) {
      return;
    }

    try {
      setIsLoadingComments(true);

      const { data } = await axios.get(
        `${API_BASE_URL}/feed/${feedId}/comments`,
        {
          params: {
            userId,
          },
        }
      );

      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  }, [feedId, userId]);

  const handleCreateComment = useCallback(async () => {
    const content = commentText.trim();

    if (!content || isSubmittingComment) {
      return;
    }

    try {
      setIsSubmittingComment(true);

      await axios.post(
        `${API_BASE_URL}/feed/${feedId}/comments`,
        {
          content,
          ...(replyTarget
            ? { parentCommentId: replyTarget.commentId }
            : {}),
        },
        {
          params: {
            userId,
          },
        }
      );

      setCommentText('');
      setReplyTarget(null);
      await getComments();
    } catch (error) {
      console.error(error);

      Alert.alert(
        '댓글 작성 실패',
        error.response?.data?.message ?? '댓글을 작성하지 못했습니다.'
      );
    } finally {
      setIsSubmittingComment(false);
    }
  }, [
    commentText,
    isSubmittingComment,
    feedId,
    userId,
    replyTarget,
    getComments,
  ]);

  const handleDeleteComment = useCallback(async () => {
    if (!commentDeleteTarget || isDeletingComment) {
      return;
    }

    try {
      setIsDeletingComment(true);

      await axios.delete(
        `${API_BASE_URL}/feed/${feedId}/comments/${commentDeleteTarget.commentId}`,
        {
          params: {
            userId,
          },
        }
      );

      setCommentDeleteTarget(null);
      await getComments();
    } catch (error) {
      console.error(error);

      Alert.alert(
        '댓글 삭제 실패',
        error.response?.data?.message ?? '댓글을 삭제하지 못했습니다.'
      );
    } finally {
      setIsDeletingComment(false);
    }
  }, [
    commentDeleteTarget,
    isDeletingComment,
    feedId,
    userId,
    getComments,
  ]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  useEffect(() => {
    if (dialogVisible || isCommentDeleteDialogVisible) {
      Keyboard.dismiss();
    }
  }, [dialogVisible, isCommentDeleteDialogVisible]);

  const [localFeed, setLocalFeed] = useState(feed);
  useEffect(() => { setLocalFeed(feed); }, [feed]);

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
    if (!dialogVisible && !isCommentDeleteDialogVisible) {
      return;
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isCommentDeleteDialogVisible) {
          handleCloseCommentDeleteDialog();
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
    <View style={styles.screen}>

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
              ? { uri: `${API_BASE_URL}${user.profileImageUrl}` }
              : null
          }
          isFollowing={isFollowing}
          isBookmarked={localFeed.isBookmarked}
          isLiked={localFeed.isLiked}
          onPressFollow={() => {
            setFollowing(f => !f);
            onPressFollow?.();
          }}
          onPressBookmark={() => toggleBookmark(localFeed)}
          onPressLike={() => toggleLike(localFeed)}
        />

        <Caption
          date={localFeed.createdAt ? formatDateDetail(localFeed.createdAt) : ''}
          bookmarkCount={localFeed.bookmarkCount}
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
                    createdAt={item.createdAt ? formatDateDetail(item.createdAt) : ''}
                    profileImageUrl={getCommentProfileSource(item.user?.profileImageUrl)}
                    depth={0}
                    onPress={() => {
                      setReplyTarget({
                        commentId: item.commentId,
                        userCode: item.user?.userCode ?? `user_${item.userId}`,
                      });
                    }}
                    onDeletePress={() => {
                      setCommentDeleteTarget(item);
                    }}
                  />

                  {item.replies?.map((reply) => (
                    <Comment
                      key={reply.commentId}
                      userCode={reply.user?.userCode ?? `user_${reply.userId}`}
                      comment={reply.content}
                      createdAt={reply.createdAt ? formatDateDetail(reply.createdAt) : ''}
                      profileImageUrl={getCommentProfileSource(reply.user?.profileImageUrl)}
                      depth={1}
                      onPress={() => {
                        setReplyTarget({
                          commentId: item.commentId,
                          userCode: item.user?.userCode ?? `user_${item.userId}`,
                        });
                      }}
                      onDeletePress={() => {
                        setCommentDeleteTarget(reply);
                      }}
                    />
                  ))}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

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
      // onLayout={(event) => {
      //   setBottomBarHeight(event.nativeEvent.layout.height);
      // }}
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
        <View style={styles.dim}>
          <Dialog
            title="댓글을 영구 삭제할까요?"
            description="삭제한 댓글은 다시 되돌릴 수 없습니다."
            cancelLabel="취소"
            confirmLabel="삭제"
            onCancel={handleCloseCommentDeleteDialog}
            onConfirm={handleDeleteComment}
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
    backgroundColor: 'rgba(0,0,0,0.85)',
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
    backgroundColor: colors.bgOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 999,
  },
});
