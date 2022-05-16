import React, { useEffect, useState } from "react";
import MyInfo from "../components/MyInfo";
import Header from "../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import userAxios, { userState } from "../axios/userAxios";
import partyAxios from "../axios/partyAxios";

interface Payload {
  userId: number;
  kakaoId: string;
  nickname: string;
}
const initPayload = {
  userId: -1,
  kakaoId: "",
  nickname: "",
};

interface groupid {
  groupId: number;
  title: string;
  menu: string;
  placeName: string;
  imageUrl: string;
  startAt: string;
  endAt: string;
  limit: number;
  host: {
    userId: number;
    nickname: string;
    profileImageUrl: string;
    careerId: number;
    year: string;
    description: string;
  };
  join: number;
}

const initGroups = [
  {
    groupId: -1,
    title: "그룹 제목",
    menu: "메뉴",
    placeName: "모임 장소",
    imageUrl:
      "https://github.com/choewy/react-place-app/blob/master/src/images/0.png?raw=true",
    startAt: "2022-05-16T12:28:11.000Z",
    endAt: "2022-05-16T12:28:11.000Z",
    limit: 0,
    host: {
      userId: -1,
      nickname: "asdasdsad",
      profileImageUrl: "",
      careerId: 1,
      year: "",
      description: "",
    },
    join: 1,
  },
];

const User = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [auth, setAuth] = useState<Payload>(initPayload);
  const [state, setState] = useState(userState.user);
  const [group, setGroup] = useState<Array<groupid>>(initGroups);

  useEffect(() => {
    //get user auth

    const injeon = async () => {
      const auth = await userAxios.authUser().then((res) => {
        const data = res;
        switch (data.statusCode) {
          case 401:
            //not login
            window.alert("login 해주셈");
            navigate("/login");
            return console.log(401);
          case 403:
            //refresh token
            return userAxios.refreshUser();
          default:
            return res;
        }
      });

      setAuth(auth.auth);

      // get user axios or otherUser axios

      if (auth.auth.userId === param.userId) {
        userAxios.getUser().then((res) => {
          setState(res.user);
        });
      } else {
        userAxios.otherUser(param.userId).then((res) => {
          setState(res.user);
        });
      }
    };

    injeon();

    //get user infomation
    partyAxios.getJoinedParty(param.userId).then((res) => {
      setGroup(res.data.groups);
    });
  }, []);

  // paint user proflie or otherUser Profile
  if (param.userId === auth.userId.toString()) {
    return (
      <React.Fragment>
        <Header
          type="user"
          text="프로필"
          home={() => navigate("/")}
          setting={() => navigate("/user/config")}
        ></Header>
        <MyInfo
          group={group}
          auth={auth}
          user={state}
          uid={param.userId}
        ></MyInfo>
      </React.Fragment>
    );
  } else if (param.userId !== auth.userId.toString()) {
    return (
      <React.Fragment>
        <Header text="프로필"></Header>
        <MyInfo
          group={group}
          auth={auth}
          user={state}
          uid={param.userId}
        ></MyInfo>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Header text="프로필"></Header>
        <h1>no infomation</h1>
      </React.Fragment>
    );
  }
};
export default User;
