import React, { useState, useEffect } from "react";
import userAxios from "../axios/userAxios";
import { Grid, Input, Button, Select, Text } from "../elements";
import { useAppSelect } from "../store/config.hook";
import useUser from "../useCustom/useUser";
import Career from "../utils/career";
import { useNavigate } from "react-router-dom";

const ModifyUser = () => {
  const navigate = useNavigate();
  const userInfo = useAppSelect((state) => state.user);
  const [user, setUser] = useState<any>({
    nickname: "",
    profileImageUrl: "",
    careerId: 1,
    year: "",
    description: "",
  });
  const info = useUser(userInfo.userId);

  useEffect(() => {
    const setting = () => {
      const user = {
        nickname: info.nickname,
        profileImageUrl: info.profileImageUrl,
        careerId: info.careerId,
        year: info.year,
        description: info.description,
      };
      setUser(user);
    };
    setting();
  }, [info]);

  const onChangeHandler = (e: any) => {
    setUser((prevState: any) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const times = [
    { value: "11:00", name: "11:00" },
    { value: "12:00", name: "12:00" },
    { value: "13:00", name: "13:00" },
    { value: "14:00", name: "14:00" },
    { value: "15:00", name: "15:00" },
  ];

  const clickToSetuser = async () => {
    userAxios.setUser(user).then((res) => {
      window.alert("정보 변경 완료");
      navigate("/");
    });
  };

  return (
    <React.Fragment>
      <Grid>
        <Input
          value={user.nickname}
          name="nickname"
          text="닉네임"
          placeholder="닉네임입력"
          _onChange={(e) => {
            onChangeHandler(e);
          }}
        ></Input>

        <Grid display="flex" flexFlow="columns wrap">
          <Grid>
            <Text>직군</Text>
            <Select onChange={() => {}} categories={times}></Select>
          </Grid>
          <Grid>
            <Text>직업</Text>
            <Select onChange={() => {}} categories={times}></Select>
          </Grid>
        </Grid>

        <Input
          _onChange={(e) => {
            onChangeHandler(e);
          }}
          value={user.year}
          name="year"
          text="연차"
          placeholder=""
        ></Input>
        <Input
          _onChange={(e) => {
            onChangeHandler(e);
          }}
          value={user.description}
          name="description"
          text="나를 표현하는 한마디"
          placeholder=""
        ></Input>
      </Grid>
      <Button _onClick={clickToSetuser}> 내 정보 수정 </Button>
    </React.Fragment>
  );
};

export default ModifyUser;
