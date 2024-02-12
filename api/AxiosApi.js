import axios from "axios";
import Commons from "../utils/Common";

const AxiosApi = {
  // 로그인
  memberLogin: async (email, pw) => {
    const login = {
      email: email,
      pwd: pw,
    };
    return await axios.post(Commons.SERVER_DOMAIN + "/auth/login", login);
  },
  // 회원 가입 여부 확인
  memberRegCheck: async (email) => {
    return await axios.get(Commons.SERVER_DOMAIN + `/auth/exists/${email}`);
  },
  // 회원 가입
  memberReg: async (email, pwd, name) => {
    const member = {
      email: email,
      pwd: pwd,
      name: name,
    };
    return await axios.post(Commons.SERVER_DOMAIN + "/auth/signup", member);
  },
  membersGet: async () => {
    return await axios.get(Commons.SERVER_DOMAIN + "/users/list");
  },
  memberGetOne: async (email) => {
    console.log("회원 정보 조회 : ", email);
    return await axios.get(Commons.SERVER_DOMAIN + `/users/detail/${email}`);
  },
  // 회원 정보 수정
  memberUpdate: async (email, name, image) => {
    console.log("회원 정보 수정 : ", email, name, image);
    const member = {
      email: email,
      name: name,
      image: image,
    };
    return await axios.put(Commons.SERVER_DOMAIN + "/users/modify", member);
  },
  // 카테고리 조회
  cateList: async () => {
    return await axios.get(Commons.SERVER_DOMAIN + "/api/category/list");
  },
  // 카테고리 등록
  cateInsert: async (email, category) => {
    const cate = {
      email: email,
      categoryName: category,
    };
    return await axios.post(Commons.SERVER_DOMAIN + "/api/category/new", cate);
  },
  // 카테고리 삭제
  cateDelete: async (categoryId) => {
    return await axios.delete(
      Commons.SERVER_DOMAIN + `/api/category/delete/${categoryId}`
    );
  },
  // 게시글 목록
  boardList: async () => {
    return await axios.get(Commons.SERVER_DOMAIN + "/api/board/list");
  },
  // 게시글 상세 정보
  boardDetail: async (boardId) => {
    return await axios.get(
      Commons.SERVER_DOMAIN + `/api/board/detail/${boardId}`
    );
  },
  // 게시글 쓰기
  boardWrite: async (
    email,
    title,
    category,
    content,
    fileUri,
    addr,
    lat,
    long
  ) => {
    console.log(
      "게시글 쓰기 : ",
      email,
      title,
      category,
      content,
      fileUri,
      addr,
      lat,
      long
    );
    const board = {
      email: email,
      title: title,
      categoryId: category,
      content: content,
      img: fileUri,
      address: addr,
      latitude: lat,
      longitude: long,
    };
    return await axios.post(Commons.SERVER_DOMAIN + "/api/board/new", board);
  },
  // 댓글 목록 가져 오기
  commentList: async (boardId) => {
    return await axios.get(
      Commons.SERVER_DOMAIN + `/api/comment/list/${boardId}`
    );
  },
  // 댓글 쓰기
  commentWrite: async (boardId, email, content) => {
    const comment = {
      boardId: boardId,
      email: email,
      content: content,
    };
    return await axios.post(
      Commons.SERVER_DOMAIN + "/api/comment/new",
      comment
    );
  },
  // 채팅방 목록 보기
  chatList: async () => {
    return await axios.get(Commons.SERVER_DOMAIN + "/chat/list");
  },
  // 채팅방 정보 보기
  chatDetail: async (roomId) => {
    console.log("Axios 채팅방 정보 : ", roomId);
    return await axios.get(Commons.SERVER_DOMAIN + `/chat/room/${roomId}`);
  },
  // 채팅방 생성
  chatCreate: async (name) => {
    const chat = {
      name: name,
    };
    return await axios.post(Commons.SERVER_DOMAIN + "/chat/new", chat);
  },
};

export default AxiosApi;
