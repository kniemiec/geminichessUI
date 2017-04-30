var chessBoard = function(){

	WP = 1;
	WN = 2;
	WB = 3;
	WR = 4;
	WQ = 5;
	WK = 6;

	BP = 7;
	BN = 8;
	BB = 9;
	BR = 10;
	BQ = 11;
	BK = 12;

	var ICONS = [
	              '',
	              jQuery('<img/>', { src: "/css/icons/chess-icons/wp.png"  }),
	              jQuery('<img/>', { src: "/css/icons/chess-icons/wn.png"  }),
	              jQuery('<img/>', { src: "/css/icons/chess-icons/wb.png"  }),
	              jQuery('<img/>', { src: "/css/icons/chess-icons/wr.png"  }),
	              jQuery('<img/>', { src: "/css/icons/chess-icons/wq.png"  }),
	              jQuery('<img/>', { src: "/css/icons/chess-icons/wk.png"  }),
	              jQuery('<img/>', { src: "/css/icons/chess-icons/bp.png"  }),
	              jQuery('<img/>', { src: "/css/icons/chess-icons/bn.png"  }),
	              jQuery('<img/>', { src: "/css/icons/chess-icons/bb.png"  }),
	              jQuery('<img/>', { src: "/css/icons/chess-icons/br.png"  }),
	              jQuery('<img/>', { src: "/css/icons/chess-icons/bq.png"  }),
	              jQuery('<img/>', { src: "/css/icons/chess-icons/bk.png"  })
	              ];

	var INITIAL_BOARD = [
		                   [ BR, BN, BB, BQ, BK,  BB, BN, ],
		                   [ BP, BP,BP,BP,BP,BP,BP,BP],
		                   [0,0,0,0,0,0,0,0],
		                   [0,0,0,0,0,0,0,0],
		                   [0,0,0,0,0,0,0,0],
		                   [0,0,0,0,0,0,0,0],
		                   [ WP, WP,WP,WP,WP,WP,WP,WP],
		                   [ WR, WN, WB, WQ, WK,  WB, WN, WR],
		                  ];

	var makeElementDraggable = function($element){
		    $element.draggable({
		      cancel: "a.ui-icon", // clicking an icon won't initiate dragging
		      revert: "invalid", // when not dropped, the item will revert back to its initial position
		      containment: "document",
		      helper: "clone",
		      cursor: "move"
		    });
		};


	return {
   //      resetBoard: function(){
			// for(var i = 0;i<8;i++){
			// 	for(var j=0;j<8;j++){
			// 	    boardTemplate[i][j] =
			// 	    	INITIAL_BOARD[i][j];
			// 	}
			// }
   //      	generateInitialBoardPosition();
   //      },
	   	isPawn : function(movedPieceType){
			return movedPieceType == WP ||
				movedPieceType == BP;
		},

		generateInitialBoardPosition: function(){
			var board  = new Array();
			for(var i = 0;i<8;i++){
				board[i] = new Array();
				for(var j=0;j<8;j++){
				    if( INITIAL_BOARD[i][j] > 0){
				        $element = ICONS[ INITIAL_BOARD[i][j] ].clone();
				        makeElementDraggable($element);
					    board[i][j]= $element;
					}
				}
			}
			return board;
		},

		drawBoard: function( $boardArea, boardPresentation){
			alert("drawing");
			$("tr", $boardArea).each( function(row){
				var tr = this;
				$(tr).children().each(function( col){
					$(this).empty();
					$(this).append(boardPresentation[row][col]);
				});
			});
		}
	};
};