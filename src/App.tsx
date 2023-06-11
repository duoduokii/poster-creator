import { useState } from "react";
import html2canvas from "html2canvas";
import camp from "./assets/camp.png";
import sunrise from "./assets/sunrise.jpg";

import "./App.css";

const imgSet = [
	{ id: "1", img: camp },
	{ id: "2", img: sunrise },
];

const userSet = [
	{ uid: "1", name: "小可" },
	{ uid: "2", name: "小小可" },
];

type User = {
	uid: string;
	name: string;
};

type Poster = {
	posterId: string;
	posterImg: string;
	userId: string;
	username: string;
};

function App() {
	const [poster, setPoster] = useState<Poster>();

	const onSelectUser = (user: User) => {
		setPoster({
			userId: user.uid,
			username: user.name,
			posterId: poster?.posterId || imgSet[0].id,
			posterImg: poster?.posterImg || imgSet[0].img,
		});
	};

	const preImg = (loop = true) => {
		if (!poster) return;
		const pIdx = imgSet.findIndex((i) => i.id === poster.posterId);
		if (pIdx <= 0 && !loop) return;
		const curIdx = pIdx <= 0 ? imgSet.length - 1 : pIdx - 1;
		return imgSet[curIdx];
	};

	const nextImg = (loop = true) => {
		if (!poster) return;
		const pIdx = imgSet.findIndex((i) => i.id === poster.posterId);
		if (pIdx >= imgSet.length - 1 && !loop) return;
		const curIdx = pIdx >= imgSet.length - 1 ? 0 : pIdx + 1;
		return imgSet[curIdx];
	};

	const prePoster = () => {
		const posterImg = preImg();
		if (!posterImg || !poster) return;
		setPoster({ ...poster, posterImg: posterImg?.img, posterId: posterImg?.id });
	};

	const nextPoster = () => {
		const posterImg = nextImg();
		if (!posterImg || !poster) return;
		setPoster({ ...poster, posterImg: posterImg?.img, posterId: posterImg?.id });
	};

	const download = () => {
		generatePoster().then((res) => {
			console.log(res);
		});
	};

	const generatePoster = () => {
		return new Promise((res, rej) => {
			const el = document.getElementById("poster-canvas");
			if (!el) {
				rej();
				return;
			}
			html2canvas(el).then((canvas) => {
				res(canvas.toDataURL("image/jpg"));
			});
		});
	};

	return (
		<>
			<p>选择用户</p>
			<div className="user-wrapper">
				{userSet.map((user) => (
					<button className={`${poster?.userId === user.uid ? "active" : ""}`} key={user.uid} onClick={() => onSelectUser(user)}>
						{user.name}
					</button>
				))}
			</div>
			<p>选择海报</p>
			<div className="btn-wrapper">
				<button onClick={prePoster}>上一张</button>
				<button onClick={nextPoster}>下一张</button>
			</div>
			<div id="poster-canvas" className="poster-wrapper">
				{poster?.posterImg && <img src={poster.posterImg} alt="" />}
			</div>
			<div className="btn-wrapper">
				<button onClick={download}>下载</button>
				{/* <button>下载全部</button> */}
			</div>
		</>
	);
}

export default App;
