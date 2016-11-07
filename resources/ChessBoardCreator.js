function columnCharToNumber(charCode){
		return charCode - 97
};

function columnNumberToChar(columnNumber){
		return String.fromCharCode(97+columnNumber)
};

function undoMove(undoMoveData) {
	alert(undoMoveData.fromElementParentId)
	alert(undoMoveData.movedPieceType.attr("src"))
	$('#'+undoMoveData.fromElementParentId).append(undoMoveData.movedPieceType)
	undoMoveData.toElement.empty()
	undoMoveData.toElement.append(undoMoveData.removedPieceType)
};

function UndoMoveData(){
	this.fromElementParentId = null
	this.toElement = null
	this.movedPieceType = null
	this.removedPieceType = null
};

UndoMoveData.prototype = {

};


function ChessBoardGenerator() {
	this.CHESS_SERVICE_URL = "http://localhost:9000/move"

	this.ICONS = [
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
	              ],
	this.WP = 1,
	this.WN = 2,
	this.WB = 3,
	this.WR = 4,
	this.WQ = 5,
	this.WK = 6,

	this.BP = 7,
	this.BN = 8,
	this.BB = 9,
	this.BR = 10,
	this.BQ = 11,
	this.BK = 12,

	this.INITIAL_BOARD = [
		                   [ this.BR, this.BN, this.BB, this.BQ, this.BK,  this.BB, this.BN, this.BR],
		                   [ this.BP, this.BP,this.BP,this.BP,this.BP,this.BP,this.BP,this.BP],
		                   [0,0,0,0,0,0,0,0],
		                   [0,0,0,0,0,0,0,0],
		                   [0,0,0,0,0,0,0,0],
		                   [0,0,0,0,0,0,0,0],
		                   [ this.WP, this.WP,this.WP,this.WP,this.WP,this.WP,this.WP,this.WP],
		                   [ this.WR, this.WN, this.WB, this.WQ, this.WK,  this.WB, this.WN, this.WR],
		                  ]

	this.boardTemplate = [
	                   [ this.BR, this.BN, this.BB, this.BQ, this.BK,  this.BB, this.BN, this.BR],
	                   [ this.BP, this.BP,this.BP,this.BP,this.BP,this.BP,this.BP,this.BP],
	                   [0,0,0,0,0,0,0,0],
	                   [0,0,0,0,0,0,0,0],
	                   [0,0,0,0,0,0,0,0],
	                   [0,0,0,0,0,0,0,0],
	                   [ this.WP, this.WP,this.WP,this.WP,this.WP,this.WP,this.WP,this.WP],
	                   [ this.WR, this.WN, this.WB, this.WQ, this.WK,  this.WB, this.WN, this.WR],
	                  ]

this.lastMoveData = null,

this.lastSpecialMoveData = null,

this.CASTLING_MOVES = [ "Ke1g1", "Ke1c1", "ke8g8", "ke8c8"],

this.CASTLING_PATTERN = [ "Rh1f1" , "Ra1d2", "rh8f8", "ra8d8"];


}

ChessBoardGenerator.prototype = {

        initializeDragAndDrop: function(){

            var $draggableWhite = $("#whitePieces");
            var $draggableBlack = $("#blackPieces");
            var $chessboard = $("#chessboard");

			this.initializeGame()

            $("img", $draggableWhite).draggable({
                          cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                          revert: "invalid", // when not dropped, the item will revert back to its initial position
                          containment: "document",
                          helper: "clone",
                          cursor: "move"
                    });

            $("img", $draggableBlack).draggable({
                  cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                  revert: "invalid", // when not dropped, the item will revert back to its initial position
                  containment: "document",
                  helper: "clone",
                  cursor: "move"
            });

            handlePutOnBoard = this.handlePutOnBoard;
            closure = this;

            $("td", $chessboard).each(function (item){
                $(this).droppable(
                        {
                            accept: "img",
                            drop: function( event, ui){
                                handlePutOnBoard( ui.draggable, $(this), closure);
                            }

                        });
            });

            removeFromBoard = this.removeFromBoard;

            $("#trash").droppable(
                {
                    accept: "img",
                    drop: function( event, ui){
                        removeFromBoard( ui.draggable, $(this), closure);
                    }

                }
            );


        },

		enableDragAndDrop: function(){
			$("body").attr("ondragstart","return true;")
		},

		disableDragAndDrop: function(){
			$("body").attr("ondragstart","return false;")
		},

        resetBoard: function(){
			for(var i = 0;i<8;i++){
				for(var j=0;j<8;j++){
				    this.boardTemplate[i][j] =
				    	this.INITIAL_BOARD[i][j];
				}
			}
        	this.generateInitialBoardPosition();
        },

		generateInitialBoardPosition: function(){
			var board  = new Array();
			for(var i = 0;i<8;i++){
				board[i] = new Array();
				for(var j=0;j<8;j++){
				    if( this.boardTemplate[i][j] > 0){
				        $element = this.ICONS[ this.boardTemplate[i][j] ].clone();
				        this.makeElementDraggable($element);
					    board[i][j]= $element;
					}
				}
			}
			this.drawBoard( $("#chessboard"), board);
		},

		drawBoard: function( $boardArea, boardPresentation){
			$("tr", $boardArea).each( function(row){
				var tr = this;
				$(tr).children().each(function( col){
					$(this).empty();
					$(this).append(boardPresentation[row][col]);
				});
			});
		},

		makeElementDraggable: function ($element){
		    $element.draggable({
		      cancel: "a.ui-icon", // clicking an icon won't initiate dragging
		      revert: "invalid", // when not dropped, the item will revert back to its initial position
		      containment: "document",
		      helper: "clone",
		      cursor: "move"
		    });
		},

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
			 return map
		},


		convertDDtoMove: function(fromRow, fromCol, toRow, toCol, closure){
			var figureSymbol = closure.getFigureTranslation(this.boardTemplate[toRow][toCol]).toUpperCase()
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

		initializeGame: function(){
			$.ajax({
				type: 'GET',
			  url: "http://localhost:9000/move/new",
			  success: function(data){
				},
				xhrFields: {
      		withCredentials: true
   			},
			  dataType: "json",
				crossDomain: true
			});

		},

		handleChessServiceRequest: function(moveDescription, closure) {
			$.ajax({
			  url: "http://localhost:9000/move/"+moveDescription,
			  data: "",
			  success: function(response){
					closure.handleResponse(response,closure)
				},
				xhrFields: {
				      withCredentials: true
			  },
			  dataType: "json",
				crossDomain: true
			});
		},

		handleResponse : function(data,closure){
			if(data['move'] == "INVALIDMOVE"){
				undoMove(closure.lastMoveData)
				if(closure.lastSpecialMoveData){
					alert('undo')
					undoMove(closure.lastSpecialMoveData)
					closure.lastSpecialMoveData = null
				}
				closure.lastMoveData = null
			} else  {
				var responseMap = closure.convertMovetoDD(data['move'])
				closure.visualiseMoveOnBoard(responseMap)
			}
			closure.enableDragAndDrop()
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

		handlePutOnBoard: function($from, $to, closure){
			var parentId = $from.parent().attr("id");
			var fromRow = parseInt(parentId.charAt(0));
			var fromCol = parseInt(parentId.charAt(1));
			closure.boardTemplate[fromRow][fromCol] = 0;
			closure.lastMoveData = new UndoMoveData()
			closure.lastMoveData.fromElementParentId = parentId
			closure.lastMoveData.toElement = $to
			closure.lastMoveData.movedPieceType = $from
			closure.lastMoveData.removedPieceType = $to.children(':first-child').clone()
			$to.empty();
			$to.append($from)
			var toId = $to.attr("id");
			toRow = parseInt(toId.charAt(0));
			toCol = parseInt(toId.charAt(1));
			closure.boardTemplate[toRow][toCol] = closure.getFigureNumberFromIcon( $from.attr("src"));
			// check if castling
			var moveDesc = closure.convertDDtoMove(fromRow,fromCol, toRow, toCol, closure)
			if(closure.CASTLING_MOVES.indexOf(moveDesc) != -1){
				var rookMovePattern = closure.CASTLING_PATTERN[closure.CASTLING_MOVES.indexOf(moveDesc)]
				var rookResponseMap = closure.convertMovetoDD(rookMovePattern)
				var rookParentId =  (8-parseInt(rookMovePattern.substring(2,3))).toString()+columnCharToNumber(rookMovePattern.substring(1,2).charCodeAt(0))
				alert(rookParentId)
				var rookDestinationParentId = (8-parseInt(rookMovePattern.substring(4,5))).toString()+columnCharToNumber(rookMovePattern.substring(3,4).charCodeAt(0))
				closure.lastSpecialMoveData = new UndoMoveData()
				closure.lastSpecialMoveData.fromElementParentId = rookParentId
				closure.lastSpecialMoveData.toElement = $("#"+rookDestinationParentId)
				closure.lastSpecialMoveData.movedPieceType = $("#"+rookParentId).children(":first-child")
				closure.lastSpecialMoveData.removedPieceType = $("#"+rookDestinationParentId).children(':first-child').clone()
				closure.visualiseMoveOnBoard(rookResponseMap)
			}
			closure.handleChessServiceRequest(moveDesc, closure)

			closure.disableDragAndDrop()
		},

	    removeFromBoard: function( $draggedItem, $droppableItem, closure){
            $parent = $draggedItem.parent();
            // check whether parent is original panel - then clone
            var parentId = $draggedItem.parent().attr("id");
            if(parentId != "whitePieces" && parentId != "blackPieces"){
                var row = parseInt(parentId.charAt(0));
                var col = parseInt(parentId.charAt(1));
                closure.boardTemplate[row][col] = 0;
                $("#fenArea").text(closure.generateFENFromPosition());

                var parentItem = $draggedItem.parent();
    	    	parentItem.empty();
            }
	    },


		generateFENFromPosition: function(){
            var FENDescription = "";
            for(var i = 0;i<8;i++){
                var freeFieldsCounter = 0;
                var line = "";
                for(var j= 0;j<8;j++){
                    if(this.boardTemplate[i][j]>0){
                        if(freeFieldsCounter>0){
                            line = line+freeFieldsCounter;
                        }
                        freeFieldsCounter = 0;
                        line = line + this.getFigureTranslation(this.boardTemplate[i][j]);
                    } else {
                        freeFieldsCounter+=1;
                    }
                }
                if(freeFieldsCounter>0){
                    line = line + freeFieldsCounter;
                }
                if(i < 7) { line = line + "/"; }
                FENDescription = FENDescription + line;
            }
            return FENDescription + this.generateFENDescSuffix();
	    },

        generateFENDescSuffix: function(){
            var FENSuffix = " ";
            // fill with default values
            // whose move
            FENSuffix = FENSuffix + "w";
             // switch
             FENSuffix = FENSuffix + " KQkq";
             // fly blow
             FENSuffix = FENSuffix + " -";
              // ply
             FENSuffix = FENSuffix + " 0";
             // full moves
             FENSuffix = FENSuffix + " 0";
             return FENSuffix;
        },


        getFigureNumberFromIcon: function(iconName){
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




	    getFigureTranslation: function( number){
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

	    }

};



/**
 *  Dodanie plugina szachy
 */
function saveChessPluginData(pluginFormId, generator) {
//	$fullPgn = '[FEN "'+$fen+'"] ' + $pgn;

	var data =  $(pluginFormId).serialize();
	$.ajax({
		type: 'POST',
		url: 'add',
		data: data,
		success: function(data){
			alert('dane zapisane');

		},
		error: function(data, textStatus, thrownError){
			alert('blad w zapisie danych');
		},
		dataType: 'html'
	});
}
