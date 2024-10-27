## 실시간 에디터 데모

프로젝트 주제 선정을 위해 만들어본 working demo.

## 링크

> https://live-share-omega.vercel.app

## 예시

https://github.com/user-attachments/assets/decc5b0e-8b07-4062-b42b-5c519f299483

<br>

## 구현 방법

### 프로젝트
`NextJS 15` 사용. <br>
다만, `React19` support을 하지 않는 패키지들이 있어서 `18.2.0`으로 downgrade.

### 텍스트 에디터
`codemirror6` 사용. (https://codemirror.net/) <br>
문서 편집을 위한 기본적인 기능만 제공하고 있는만큼, 목적에 맞게 이용하기 적절하다는 생각이 듬.

### 텍스트 내용 실시간 동기화
`partyKit` 사용. (https://docs.partykit.io/reference/y-partykit-api/) <br>
프로젝트 시에는 소켓 관리 부분을 직접해보거나, `SocketIO`를 사용할 수 있을 것 같음.

### 라이브 커서
커서의 위치를 계산해서 동기화. <br>
다른 사용자의 커서는 `<div>`로 표현.

### 다른 파일로 이동 시 코드 내용 유지
데모인만큼 서버에 코드 내용을 저장하고 있지 않기 때문에 conditional하게 `render`하게 되면 
다른 파일로 이동 시 코드 내용이 유지되지 않음. 

이를 해결하기 위해, `portal`로 실제로는 다른 곳에 모든 파일에 대한 에디터를 `render` 시키고, 
에디터 위치에는 현재 선택된 파일에 대한 에디터만 보여줌. 
> 예전에 여기서 봤던 방식 (https://youtu.be/uEnLhxL8Afs?si=tUe8n7oDAGjU_7jO)

<br>

## 예상 해결 과제 및 문제점
### BE

**터미널 구현**

터미널에서 명령어를 실행할 수 있어야 하기 때문에 실행 환경 도커 이미지를 만들어서 띄워줘야 할 것 같음. 

**커밋 구현**

커밋을 위한 action을 만들어줘야 함. 
사용자가 깃허브의 리포를 연동했을 때, action을 만들어줘야 하고 커밋 시에는 커밋이 완료되면 notify해줄 수 있어야 함.

**코드 상태 저장**

실시간으로 코드를 저장해줘야 함. `Socket` 구현 서버에서 해주면 될 것 같음. 

### FE

**`preview`용 브라우저**

프론트엔드 프로젝트를 위해 `preview`용 브라우저를 넣어줘야함.. 어떻게 하는지 모름..

**에디터 세부 기능**

shortcut 등 에디터 세부 기능에서 구현해야할 것이 너무 많음.. <br>
`Replit`에서 keybinding 라이브러리들을 만들어놓은게 있긴 한데 그걸 고려해도 쉽지 않을 듯. (https://blog.replit.com/codemirror) <br>
intellisense만 생각해도 벌써 머리가 아프다..

**테스트 및 에러 처리의 문제**

여러 사용자가 동시에 사용해야 하고, user interaction이 많다보니까 테스트나 에러 처리 난이도가 확 증가함.

<br>

## 결론

> 모르겠당.
