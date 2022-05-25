import React from "react";
import styled from "styled-components";

interface Data {
  locationX: number;
  locationY: number;
  address: string;
  placeName: string;
}

const NewKakaoMap = () => {
  const [X, setX] = React.useState<number>();
  const [Y, setY] = React.useState<number>();
  const [map, setMap] = React.useState<any>();
  const search = React.useRef<any>(null);
  const [keyword, setKeyword] = React.useState("");
  const [data, setData] = React.useState<Data>();

  const markerImage = new window.kakao.maps.MarkerImage(
    "http://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png",
    new window.kakao.maps.Size(28, 38)
  );

  React.useEffect(() => {
    console.log(data);
  }, [data]);

  React.useEffect(() => {
    if (keyword !== "") {
      console.log(X, Y);
      const ps = new window.kakao.maps.services.Places();
      const location = new window.kakao.maps.LatLng(X, Y);
      const radius = 3000;
      // 키워드로 장소를 검색합니다
      ps.keywordSearch(keyword, placesSearchCB, { location, radius });
    }
  }, [keyword]);

  React.useEffect(() => {
    const mapContainer = document.getElementById("map"); // 지도를 표시할 div

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setX(position.coords.latitude);
        setY(position.coords.longitude);
        const mapOption = {
          center: new window.kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          ), // 지도의 중심좌표
          level: 4,
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        window.kakao.maps.event.addListener(map, "dragend", function () {
          // 지도 중심좌표를 얻어옵니다
          const center = map.getCenter();
          setX(center.getLat());
          setY(center.getLng());
        });
        setMap(map);
      });
    }
  }, []);

  function placesSearchCB(data: any, status: any) {
    if (status === window.kakao.maps.services.Status.OK) {
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      const bounds = new window.kakao.maps.LatLngBounds();
      for (let i = 0; i < data.length; i++) {
        searchDisplayMarker(data[i]);
        bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
      }

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      // map.setBounds(bounds);
    }
  }
  function searchDisplayMarker(place: any) {
    const marker = new window.kakao.maps.Marker({
      map: map,
      position: new window.kakao.maps.LatLng(place.y, place.x),
      image: markerImage,
    });

    const iwContent = "", // 인포윈도우에 표시할 내용
      iwRemoveable = true;

    // 인포윈도우를 생성합니다
    const infowindow = new window.kakao.maps.InfoWindow({
      content: iwContent,
      removable: iwRemoveable,
    });

    // 마커에 클릭이벤트를 등록합니다
    window.kakao.maps.event.addListener(marker, "click", function () {
      // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
      infowindow.setContent(
        '<div style="padding:5px;font-size:12px;">' +
          place.place_name +
          "</div>"
      );
      infowindow.open(map, marker);
      setData({
        placeName: place.place_name,
        locationX: place.x,
        locationY: place.y,
        address: place.address_name,
      });
    });
  }

  const handleSearch = () => {
    setKeyword(search.current.value);
  };

  // const handleKeyPress = (e: any) => {
  //   e.stopPropagation();
  //   if (e.key === "Enter") {
  //     handleSearch();
  //   }
  // };

  return (
    <React.Fragment>
      <MapContainer id="map"></MapContainer>
      <Wrap>
        <SearchInput ref={search}></SearchInput>
        <SearchButton onClick={handleSearch}>검색</SearchButton>
      </Wrap>
    </React.Fragment>
  );
};

const MapContainer = styled.div`
  aspect-ratio: 400/250;
  z-index: 0;
`;

const Wrap = styled.div`
  margin: 10px 0px 10px 0px;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 3;
`;

const SearchInput = styled.input`
  font-size: 12px;
  padding: 3px;
  outline: none;
  width: 40%;
`;

const SearchButton = styled.div`
  width: 50px;
  height: 30px;
  border: 0px;
  background: #1b5ac2;
  outline: none;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
export default NewKakaoMap;
