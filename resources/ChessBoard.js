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

	var getFigureTranslation = function(number){
	        switch (number){
	            case this.WP : {
	                return 'P';
	            }
	            case this.WN : {
	                return 'N';
	            }
	            case this.WB : {
	                return 'B';
	            }
	            case this.WR : {
	                return 'R';
	            }
	            case this.WQ : {
	                return 'Q';
	            }
	            case this.WK : {
	                return 'K';
	            }
	            case this.BP : {
	                return 'p';
	            }
	            case this.BN : {
	                return 'n';
	            }
	            case this.BB : {
	                return 'b';
	            }
	            case this.BR : {
	                return 'r';
	            }
	            case this.BQ : {
	                return 'q';
	            }
	            case this.BK : {
	                return 'k';
	            }
	        }

	};

	var columnCharToNumber = function(charCode){
		return charCode - 97
	};

	var columnNumberToChar = function(columnNumber){
			return String.fromCharCode(97+columnNumber)
	};





	return {
		convertMovetoDD: function(move){
			 var map = new Object()
			 var moveWithoutFigureSymbol = move
			 if(move.charCodeAt(0) < 97) {
				 moveWithoutFigureSymbol = move.substring(1)
			 }
			 map['fromCol'] =  columnCharToNumber(moveWithoutFigureSymbol.charCodeAt(0))
			 map['fromRow'] = 8 - parseInt(moveWithoutFigureSymbol.charAt(1))
			 map['toCol'] =  columnCharToNumber(moveWithoutFigureSymbol.charCodeAt(2))
			 map['toRow'] = 8 -  parseInt(moveWithoutFigureSymbol.charAt(3))
			 if(moveWithoutFigureSymbol.length > 4) {
				 // ther is promotion to another figure
				 map['promotion'] = moveWithoutFigureSymbol.charAt(4)
			 }
			 return map;
		},

		convertDDtoMove: function(fromRow, fromCol, toRow, toCol, figureDD){
			var figureSymbol = getFigureTranslation(figureDD).toUpperCase()
			var fromColSymbol = columnNumberToChar(fromCol)
			var toColSymbol = columnNumberToChar(toCol)
			var fromBoardRow = 8 - fromRow
			var toBoardRow = 8 - toRow
			var result = ""
			if(figureSymbol == 'p'  || figureSymbol == 'P') rsult = ""
			else result = figureSymbol
			result = result + fromColSymbol + fromBoardRow + toColSymbol + toBoardRow
			return result
		},
	
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


    getFigureNumberFromIcon :function(iconName){
            switch (iconName){
                case"/css/icons/chess-icons/wp.png" : {
                    return 1;
                }
                case"/css/icons/chess-icons/wn.png" : {
                    return 2;
                }
                case"/css/icons/chess-icons/wb.png" : {
                    return 3;
                }
                case"/css/icons/chess-icons/wr.png" : {
                    return 4;
                }
                case"/css/icons/chess-icons/wq.png" : {
                    return 5;
                }
                case"/css/icons/chess-icons/wk.png" : {
                    return 6;
                }
                case"/css/icons/chess-icons/bp.png" : {
                    return 7;
                }
                case"/css/icons/chess-icons/bn.png" : {
                    return 8;
                }
                case"/css/icons/chess-icons/bb.png" : {
                    return 9;
                }
                case"/css/icons/chess-icons/br.png" : {
                    return 10;
                }
                case"/css/icons/chess-icons/bq.png" : {
                    return 11;
                }
                case"/css/icons/chess-icons/bk.png" : {
                    return 12;
                }
            }
            return;
        },


		visualiseMoveOnBoard : function(responseMap) {
			var boardCellFromId = responseMap['fromRow'].toString()+responseMap['fromCol'].toString()
			var boardCellToId = responseMap['toRow'].toString()+responseMap['toCol'].toString()
			var fromCell = $("#"+boardCellFromId)
			var toCell = $("#"+boardCellToId)
			var movedItem = fromCell.children(':first-child').clone()
			alert('movedItem'+movedItem.attr("id"))
			fromCell.empty()
			toCell.empty();
			toCell.append(movedItem);
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