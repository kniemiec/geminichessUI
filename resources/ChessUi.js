var chessUi = function(chessboard){

	var boardTemplate;

	var handlePutOnBoard = function($from, $to){
			var parentId = $from.parent().attr("id");
			var fromRow = parseInt(parentId.charAt(0));
			var fromCol = parseInt(parentId.charAt(1));
			// board template is empty TODO
			if(chessboard.isPawn(boardTemplate[fromRow][fromCol])){
				if(ChessBoard.isEnPassantMove(parentId, $to.attr("id"))){
					boardTemplate[fromRow][fromCol] = 0;
					var enpassantRow = fromRow;
					var enpassantCol = getColFromId($to.attr("id"));
					closure.boardTemplate[enpassantRow][enpassantCol] = 0;

					generator.lastMoveData = Object.create( UndoMoveData.prototype);
					generator.lastMoveData.fromElementParentId = parentId
					generator.lastMoveData.toElement = $to
					generator.lastMoveData.movedPieceType = $from
					generator.lastMoveData.removedElement = $("#"+getId(enpassantRow,enpassantCol));
					generator.lastMoveData.removedPieceType = generator.lastMoveData.removedElement.children(':first-child').clone()

					// remove pawn that moved before
					$("#"+generator.lastMoveData.removedElement).empty();
				} else {
					// promotion
				}
			} else {
				generator.boardTemplate[fromRow][fromCol] = 0;
				generator.lastMoveData = Object.create( UndoMoveData.prototype);
				generator.lastMoveData.fromElementParentId = parentId
				generator.lastMoveData.toElement = $to
				generator.lastMoveData.movedPieceType = $from
				generator.lastMoveData.removedPieceType = $to.children(':first-child').clone()
				generator.lastMoveData.removedElement = $to
			}
			$to.empty();
			$to.append($from)
			var toId = $to.attr("id");
			toRow = parseInt(toId.charAt(0));
			toCol = parseInt(toId.charAt(1));
			generator.boardTemplate[toRow][toCol] = generator.getFigureNumberFromIcon( $from.attr("src"));
			// check if castling
			var moveDesc = closure.convertDDtoMove(fromRow,fromCol, toRow, toCol, closure)
			if(generator.CASTLING_MOVES.indexOf(moveDesc) != -1){
				var rookMovePattern = closure.CASTLING_PATTERN[closure.CASTLING_MOVES.indexOf(moveDesc)]
				var rookResponseMap = closure.convertMovetoDD(rookMovePattern)
				var rookParentId =  (8-parseInt(rookMovePattern.substring(2,3))).toString()+columnCharToNumber(rookMovePattern.substring(1,2).charCodeAt(0))
				alert(rookParentId)
				var rookDestinationParentId = (8-parseInt(rookMovePattern.substring(4,5))).toString()+columnCharToNumber(rookMovePattern.substring(3,4).charCodeAt(0))
				generator.lastSpecialMoveData = new UndoMoveData();
				generator.lastSpecialMoveData.fromElementParentId = rookParentId;
				generator.lastSpecialMoveData.toElement = $("#"+rookDestinationParentId);
				generator.lastSpecialMoveData.movedPieceType = $("#"+rookParentId).children(":first-child")
				generator.lastSpecialMoveData.removedPieceType = $("#"+rookDestinationParentId).children(':first-child').clone()
				generator.visualiseMoveOnBoard(rookResponseMap)
			}
			generator.handleChessServiceRequest(moveDesc, generator)

			generator.disableDragAndDrop()
		};

		var	initializeGame = function(){
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

		};


	return {
        initializeDragAndDrop: function(){
        	boardTemplate = chessboard.generateInitialBoardPosition();
        	chessboard.drawBoard($("#chessboard"),boardTemplate);

            var $draggableWhite = $("#whitePieces");
            var $draggableBlack = $("#blackPieces");
            var $chessboard = $("#chessboard");

			initializeGame();

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

            // handlePutOnBoard = this.handlePutOnBoard;
            alert("test");

            $("td", $chessboard).each(function (item){
                $(this).droppable(
                        {
                            accept: "img",
                            drop: function( event, ui){
                            	alert("yes");
                                handlePutOnBoard( ui.draggable, $(this));
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
		
	}
};