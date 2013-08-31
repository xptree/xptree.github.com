---
layout: post
title: "Qt GraphicsView框架"
description: ""
category: 
tags: [Qt]
---
{% include JB/setup %}

##大作业日志

本次我的大作业实现了下列功能

- 基于`QMainWindow`，带有菜单栏和工具栏
- 界面可以弹出窗口，用于读入输入文件（给定输入点坐标）
- 可以在窗口中绘制输入的所有点
- 自选某一RST求解方法，集成源码，求得RST，并在窗口中绘制结果
- 界面可以弹出窗口，用于添加一个新的输入点
- 支持用户删除某个输入点（双击删除点）
- 支持鼠标点击添加新输入点和移动原有输入点，拖拽点直接进行移动，按`Control`+单击加入新点
- 提供多种RST求解方法，供用户选择使用（使用Strategy模式加入了`LMST`和`ZMST`两个算法）
- 支持显示区域的缩放（实现滚轮缩放和鼠标中心缩放）
- 带有导航小地图


##Qt GraphicsView Framework介绍

Qt的GraphicsViewFramwork由三个类组成

- QGraphicsItem
- QGraphicsScene
- QGraphicsView

###QGraphicsItem

QGraphicsItem类是一个图元类，可以通过派生得到自定义图元类。

	class myItem : public QGraphicsItem
	{
	public:
		......
	    QRectF boundingRect() const;
	    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option,
			   QWidget *widget);
	protected:
	    void mouseReleaseEvent(QGraphicsSceneMouseEvent *event);
	    void mouseDoubleClickEvent(QGraphicsSceneMouseEvent *event);

	public slots:
	    void renewPos(int xval, int yval);
		......
	};

具体而言：

- `boundingRect` 该函数为`QGraphicsView`提供的纯虚函数，派生类必须重写，同时`paint`函数绘制的绘制操作必须在该矩形内进行
- `paint` `QGraphicsItem`绘制自己的函数，同样是纯虚函数
- `mouseReleaseEvent` 我定义这个操作作为移动点的标志，每次鼠标释放以后检查现有坐标和原坐标是否相同
- `mouseDoubleClickEvent` 我定义双击事件为删除点操作
- `QGraphicsItem`类不是从`QObject`派生而来，因而无法使用信号与槽机制

###QGraphicsScene

`QGraphicsScene`是一个场景类，它管理所有的图元。在这份大作业中我主要用到的函数有：

	void QGraphicsScene::addItem(QGraphicsItem * item)
	QGraphicsLineItem * QGraphicsScene::addLine(const QLineF & line, const QPen & pen = QPen())
	void QGraphicsScene::removeItem(QGraphicsItem * item)


###QGraphicsView

`QGraphicsView`是一个视角类，可以理解为图元和场景都是唯一的，但是视角可以有多个，并且不同的视角看到的效果也是不同的,这里主要介绍下`setMatrix`这个函数：

	void QGraphicsView::setMatrix(const QMatrix & matrix, bool combine = false)

`Qt`中的`QMatrix`类是用来封装2D变换的一个类（诸如缩放，旋转等等）。我们通过捕捉到鼠标滚轮事件就可以出发这个函数，对当前视角进行变换了。

