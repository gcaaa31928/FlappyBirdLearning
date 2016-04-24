# FlappyBirdLearning

[![Build Status](https://travis-ci.org/gcaaa31928/FlappyBirdLearning.svg?branch=master)](https://travis-ci.org/gcaaa31928/FlappyBirdLearning)
[![Coverage Status](https://coveralls.io/repos/github/gcaaa31928/FlappyBirdLearning/badge.svg?branch=master)](https://coveralls.io/github/gcaaa31928/FlappyBirdLearning?branch=master)


此為利用機器學習的方式自動學習flappy bird的專案，而學習方法則是用Q Learning

### Get started
```bash
npm install
bower install
```

### Game Framework
利用Phaser.js製作出flappy bird遊戲，如下圖

(參考至 http://www.lessmilk.com/tutorial/flappy-bird-phaser-1)
![](http://i.imgur.com/txWQzas.png)

### Q Learning
![](http://i.imgur.com/eaO31P2.png)

重點在於這一個公式

而一開始利用這個公式訓練時碰到了一些困難

![](http://i.imgur.com/Mu5oNb3.png)

當只使用這兩個狀態空間時，也就是QState是一個二維的空間

造成在低點的障礙物無法得知離地面或是離天空的距離而常常超出邊界

所以我加上了一個狀態空間，為到天空的距離

![](http://i.imgur.com/8RofM8h.png)

但這又引發了別的問題，當我一般的速度通過磚塊時，理論上會以這個方式行動
![](http://i.imgur.com/Iq53cW3.png)

紅點的位置會慢慢訓練成不按的情況下Q Value會比按的情況下高

但在這個情況時
![](http://i.imgur.com/YVnAD7j.png)
由於下降的速度太快，導致於Q Value訓練成必須要按下之後才能避免撞到磚塊

也因為這兩個狀態沒辦法收斂到正確的位置，而收斂到了其他的位置

所以我們必須再加一個狀態空間為速度這個空間


基本上這樣就可以完成練習了





### Authors and Contributors
@gcaa31928

### Support or Contact
有任何意見可以開issues或是pull request


