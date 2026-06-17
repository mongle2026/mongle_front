---
description: iOS 시뮬레이터에서 mongle_front 개발 빌드를 실행한다
---

# mongle_front 시뮬레이터 실행

## 전제 조건

- Xcode + iOS Simulator 설치됨
- `expo-dev-client` 빌드가 DerivedData에 존재:
  `~/Library/Developer/Xcode/DerivedData/monglefront-*/Build/Products/Debug-iphonesimulator/monglefront.app`
- `.env` 파일에 `EXPO_PUBLIC_API_BASE_URL` 설정됨

## 실행 순서

### 1. Metro 번들러 백그라운드 시작

```bash
cd /Users/sail/Documents/School/capstone/mongle_front
npx expo start --port 8081 &
```

Metro가 `packager-status:running`을 출력할 때까지 대기:
```bash
sleep 5 && curl -s http://localhost:8081/status
# → packager-status:running
```

### 2. 시뮬레이터 부팅 + 앱 설치

```bash
APP_PATH=~/Library/Developer/Xcode/DerivedData/monglefront-aakpfyirgbwpqkctqyqvinspoxnr/Build/Products/Debug-iphonesimulator/monglefront.app
SIM_UDID=4067246D-2BF9-4590-B5E2-B7A28B81E177  # iPhone 16, iOS 18.4

xcrun simctl boot $SIM_UDID
open -a Simulator
xcrun simctl install $SIM_UDID "$APP_PATH"
```

> DerivedData 경로의 해시가 바뀌었을 경우:
> `find ~/Library/Developer/Xcode/DerivedData -name "monglefront.app" -path "*/Debug-iphonesimulator/*"`

### 3. 앱 실행

```bash
xcrun simctl launch 4067246D-2BF9-4590-B5E2-B7A28B81E177 com.dongle44.mongle-front
```

### 4. Expo Dev Client에서 서버 연결

- 시뮬레이터에 Expo Dev Client 화면이 뜨면 `http://localhost:8081` 행을 클릭
- 번들링이 완료되면(약 20~30초) 앱 메인 화면 진입

## 번들 ID / 앱 정보

| 항목 | 값 |
|---|---|
| Bundle Identifier | `com.dongle44.mongle-front` |
| Simulator | iPhone 16 (UDID: `4067246D-2BF9-4590-B5E2-B7A28B81E177`) |
| Metro 포트 | `8081` |

## 네이티브 재빌드가 필요한 경우

의존성 변경 등으로 `.app` 빌드가 구버전이면:
```bash
cd /Users/sail/Documents/School/capstone/mongle_front
npx expo run:ios --simulator "iPhone 16"
```
빌드 완료 후 위 순서대로 재실행.
