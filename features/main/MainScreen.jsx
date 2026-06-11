import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { View, FlatList, Image, StyleSheet, Text } from 'react-native';

const API_BASE_URL = 'http://192.168.0.3:3000';
// const API_BASE_URL = 'http://172.19.77.207:3000';
// const API_BASE_URL = 'http://172.19.19.169:3000';
// const API_BASE_URL = 'http://192.168.0.5:3000';



function FeedItem({ feed }) {
  return (
    <View style={styles.feedItem}>
      <Text style={styles.username}>@{feed.user?.username}</Text>

      <Text style={styles.nickname}>{feed.user?.nickname}</Text>

      {feed.record?.text ? (
        <Text style={styles.contentText}>{feed.record.text}</Text>
      ) : null}

      {feed.files
        ?.filter((file) => file.mimeType?.startsWith('image/'))
        .map((file) => (
          <Image
            key={String(file.fileId)}
            source={{ uri: file.url }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
    </View>
  );
}

const MainScreen = () => {
  const [feedData, setFeedData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/feed`);
      setFeedData(response.data);

      return;
    } catch {
      return;
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const renderItem = ({ item }) => {
    return (
      <View style={styles.feedItem}>
        <Text style={styles.username}>
          @{item.user?.username}
        </Text>

        <Text style={styles.nickname}>
          {item.user?.nickname}
        </Text>

        <Text style={styles.date}>
          {item.record?.date}
        </Text>

        {item.record?.text ? (
          <Text style={styles.contentText}>
            {item.record.text}
          </Text>
        ) : null}

        <View style={styles.fileContainer}>
          {item.files
            ?.filter((file) => file.mimeType?.startsWith('image/'))
            .map((file) => (
              <Image
                key={String(file.fileId)}
                source={{ uri: file.url }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={feedData}
      keyExtractor={(item) => String(item.feedId)}
      renderItem={({ item }) => <FeedItem feed={item} />}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    gap: 16,
  },
  feedItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    gap: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  nickname: {
    fontSize: 13,
  },
  date: {
    fontSize: 12,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22,
  },
  fileContainer: {
    marginTop: 8,
    gap: 8,
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 12,
  },
});

export default MainScreen