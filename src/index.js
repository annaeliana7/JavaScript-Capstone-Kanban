import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons';

import displayCard from './modules/displayCard.js';
import incrementLikes from './modules/increaseLikes.js';
import displayComment from './modules/displayComment.js';
import InvolvementAPI from './modules/API.js';
import likeGetData from './modules/getLikeData.js';
import itemsCounter from './modules/itemsCounter.js';
import displayCount from './modules/cardCounter.js';
import countComments from './modules/countComments';

const baseUrl =
  'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/f9a0uWRwRqUh4EVjZ7AB';

require('bootstrap-icons/font/bootstrap-icons.css');

const URL = 'https://api.disneyapi.dev/characters';

const renderComment = async (information, index, popup) => {
  const comments = await InvolvementAPI.getComments(information[index]._id);
  await displayComment(information[index], popup, comments);
  // Add event listener for close popup button
  const closepopup = document.querySelector('.close-popup');
  closepopup.addEventListener('click', () => {
    popup.style.display = 'none';
    popup.innerHTML = '';
  });
  const commentTitle = document.querySelector('.comment-title');
  const ulComment = document.querySelector('.ul-comment');

  const nbOfComments = countComments(ulComment);
  commentTitle.innerHTML = `Comments(${nbOfComments})`;
  // Add event listener for send comment
  const form = document.querySelector('#send-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { elements } = form;
    const id = elements[0].value;
    const name = elements[1].value;
    const comment = elements[2].value;
    await InvolvementAPI.sendComment(id, name, comment);
    form.reset();
    await renderComment(information, index, popup);
  });
};

const getData = async () => {
  const res = await fetch(URL);
  const data = await res.json();
  const information = data.data;
  const divRow = document.querySelector('.row');
  const popup = document.querySelector('.popup__container');
  const likes = await likeGetData();
  displayCard(information, divRow, likes);
  const itemCount = document.querySelectorAll('.icon-box');
  displayCount(itemsCounter(itemCount));
  // Select list of comment buttons after getting rendered by displayCard
  const commentBtn = document.querySelectorAll('.comments');
  commentBtn.forEach((comment, index) => {
    comment.addEventListener('click', async () => {
      popup.style.display = 'block';
      await renderComment(information, index, popup);
    });
  });
  const likeButton = document.querySelectorAll('.like-button');
  likeButton.forEach((like, index) => {
    like.addEventListener('click', () => {
      incrementLikes(information[index]._id, baseUrl);
      location.reload();
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  getData();
});
