import React, { useEffect, useState, ReactNode } from 'react';
import { Config } from 'react-native-config';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { getToken } from '../../../helpers/keychain';
import { toThumbnailName } from '../../../api/storage';
const API_STORAGE_URL = Config && Config.API_STORAGE_URL || "http://localhost:8002";


const ImagesGrid = ({
  urls,
  isTouchable = true,
}: {
  urls: string[];
  isTouchable?: boolean;
}) => {
  const n = urls.length;
  const [token, setToken] = useState<string | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    const load = async () => {
      const newToken = await getToken();
      setToken(newToken);
    };
    load();
  }, []);

  const openViewer = (idx: number) => {
    setActiveIndex(idx);
    setViewerVisible(true);
  };

  const LoadableImage = ({
    uri,
    style,
    onPress,
    children,
    resizeMode = 'cover',
  }: {
    uri: string;
    style: any;
    onPress?: () => void;
    children?: ReactNode;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'center' | 'repeat';
  }) => {
    const [loading, setLoading] = useState(true);

    if(!isTouchable){
      return (
        <View style={[style, { overflow: 'hidden' }]}
        >
          <Image
            source={{
              uri: toThumbnailName(`${API_STORAGE_URL}/api/v1/images/${uri}/`),
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }}
            style={StyleSheet.absoluteFillObject}
            resizeMode={resizeMode}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator color="#9AA0A6" />
            </View>
          )}
          {children}
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} disabled={!onPress}>
        <View style={[style, { overflow: 'hidden' }]}
        >
          <Image
            source={{
              uri: toThumbnailName(`${API_STORAGE_URL}/api/v1/images/${uri}/`),
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }}
            style={StyleSheet.absoluteFillObject}
            resizeMode={resizeMode}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator color="#9AA0A6" />
            </View>
          )}
          {children}
        </View>
      </TouchableOpacity>
    );
  };

  let content;

  if (n === 1) {
    content = (
      <LoadableImage uri={urls[0]} style={styles.one} onPress={() => openViewer(0)} />
    );
  } else if (n === 2) {
    content = (
      <View style={{ gap: 8 }}>
        <LoadableImage uri={urls[0]} style={styles.twoItem} onPress={() => openViewer(0)} />
        <LoadableImage uri={urls[1]} style={styles.twoItem} onPress={() => openViewer(1)} />
      </View>
    );
  } else if (n === 3) {
    content = (
      <View style={styles.row}>
        <LoadableImage uri={urls[0]} style={styles.leftLarge} onPress={() => openViewer(0)} />
        <View style={styles.colRightSmall}>
          <LoadableImage uri={urls[1]} style={styles.rightSmall} onPress={() => openViewer(1)} />
          <LoadableImage uri={urls[2]} style={styles.rightSmall} onPress={() => openViewer(2)} />
        </View>
      </View>
    );
  } else {
    const first4 = urls.slice(0, 4);
    const rest = urls.length - 4;
    content = (
      <View style={styles.grid}>
        {first4.map((u, idx) => (
          <LoadableImage
            key={u + idx}
            uri={u}
            style={styles.gridItem}
            onPress={() => openViewer(idx)}
          >
            {idx === 3 && rest > 0 && (
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>{`+${rest}`}</Text>
              </View>
            )}
          </LoadableImage>
        ))}
      </View>
    );
  }

  return (
    <>
      {content}
      <Modal
        visible={viewerVisible}
        transparent={false}
        onRequestClose={() => setViewerVisible(false)}
      >
        <View style={styles.viewer}>
          <FlatList
            data={urls}
            horizontal
            pagingEnabled
            keyExtractor={(item, idx) => item + idx}
            initialScrollIndex={activeIndex}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            renderItem={({ item }) => (
              <LoadableImage
                uri={item}
                style={{ width, height, backgroundColor: 'black' }}
                resizeMode="contain"
                onPress={() => setViewerVisible(false)}
              />
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setViewerVisible(false)}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const RADIUS = 16;
const TILE_H = 160;

const styles = StyleSheet.create({
  one: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: RADIUS,
  },
  twoItem: {
    width: '100%',
    height: TILE_H,
    borderRadius: RADIUS,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  leftLarge: {
    flex: 2,
    height: TILE_H * 2 + 8,
    borderRadius: RADIUS,
  },
  colRightSmall: {
    flex: 1,
    gap: 8,
  },
  rightSmall: {
    width: '100%',
    height: TILE_H,
    borderRadius: RADIUS,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: {
    width: '48.7%',
    height: TILE_H,
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },

  footer: {
    marginTop: 12,
  },
  dateText: {
    color: '#9AA0A6',
    fontSize: 12,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  viewer: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    color: '#fff',
    fontSize: 30,
  },
});

export default ImagesGrid;
