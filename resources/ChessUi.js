function UndoMoveData(){
	this.fromElementParentId = null;
	this.toElement = null;
	this.movedPieceType = null;
	this.removedPieceType = null;
	this.removedElement = null;
};

var chessUi = function(chessboard){

	var CASTLING_MOVES = [ "Ke1g1", "Ke1c1", "ke8g8", "ke8c8"];

	var CASTLING_PATTERN = [ "Rh1f1" , "Ra1d2", "rh8f8", "ra8d8"];	

	var boardTemplate;

	var lastMoveData;

	var undoMove = function (undoMoveData) {
		$('#'+undoMoveData.fromElementParentId).append(undoMoveData.movedPieceType);
		undoMoveData.toElement.empty();
		undoMoveData.removedElement.empty();
		undoMoveData.removedElement.append(undoMoveData.removedPieceType);
	};

	var handleChessServiceRequest = function(moveDescription, closure) {
			$.ajax({
			  url: "http://localhost:9000/move/"+moveDescription,
			  data: "",
			  success: function(response){
					handleResponse(response,closure)
				},
				xhrFields: {
				      withCredentials: true
			  },
			  dataType: "json",
				crossDomain: true
			});
		};

	var handleResponse = function(data){
			if(data['move'] == "INVALIDMOVE"){
				alert[lastMoveData.fromElementParentId];
				undoMove(lastMoveData)
				if(lastSpecialMoveData){
					undoMove(lastSpecialMoveData)
					lastSpecialMoveData = null
				}
				lastMoveData = null
			} else  {
				var responseMap = chessboard.convertMovetoDD(data['move'])
				visualiseMoveOnBoard(responseMap)
			}
			chessboard.blockMoving();
		};		

	var visualiseMoveOnBoard = function(responseMap) {
			var boardCellFromId = responseMap['fromRow'].toString()+responseMap['fromCol'].toString()
			var boardCellToId = responseMap['toRow'].toString()+responseMap['toCol'].toString()
			var fromCell = $("#"+boardCellFromId)
			var toCell = $("#"+boardCellToId)
			var movedItem = fromCell.children(':first-child').clone()
			alert('movedItem'+movedItem.attr("id"))
			fromCell.empty()
			toCell.empty();
			toCell.append(movedItem);
	};



	var handlePutOnBoard = function($from, $to){
			var parentId = $from.parent().attr("id");
			var fromRow = parseInt(parentId.charAt(0));
			var fromCol = parseInt(parentId.charAt(1));
			// board template is empty TODO
			if(chessboard.isPawn(boardTemplate[fromRow][fromCol])){
				if(chessboard.isEnPassantMove(parentId, $to.attr("id"))){
					boardTemplate[fromRow][fromCol] = 0;
					var enpassantRow = fromRow;
					var enpassantCol = getColFromId($to.attr("id"));
					boardTemplate[enpassantRow][enpassantCol] = 0;

					lastMoveData = Object.create( UndoMoveData.prototype);
					lastMoveData.fromElementParentId = parentId
					lastMoveData.toElement = $to
					lastMoveData.movedPieceType = $from
					lastMoveData.removedElement = $("#"+getId(enpassantRow,enpassantCol));
					lastMoveData.removedPieceType = lastMoveData.removedElement.children(':first-child').clone()

					// remove pawn that moved before
					$("#"+lastMoveData.removedElement).empty();
				} else {
					// promotion
				}
			} else {
				boardTemplate[fromRow][fromCol] = 0;
				lastMoveData = Object.create( UndoMoveData.prototype);
				lastMoveData.fromElementParentId = parentId
				lastMoveData.toElement = $to
				lastMoveData.movedPieceType = $from
				lastMoveData.removedPieceType = $to.children(':first-child').clone()
				lastMoveData.removedElement = $to
			}
			$to.empty();
			$to.append($from)
			var toId = $to.attr("id");
			toRow = parseInt(toId.charAt(0));
			toCol = parseInt(toId.charAt(1));
			boardTemplate[toRow][toCol] = chessboard.getFigureNumberFromIcon( $from.attr("src"));
			// check if castling
			var moveDesc = chessboard.convertDDtoMove(fromRow,fromCol, toRow, toCol, boardTemplate[toRow][toCol])
			if(CASTLING_MOVES.indexOf(moveDesc) != -1){
				var rookMovePattern = CASTLING_PATTERN[CASTLING_MOVES.indexOf(moveDesc)]
				var rookResponseMap = convertMovetoDD(rookMovePattern)
				var rookParentId =  (8-parseInt(rookMovePattern.substring(2,3))).toString()+columnCharToNumber(rookMovePattern.substring(1,2).charCodeAt(0))
				alert(rookParentId)
				var rookDestinationParentId = (8-parseInt(rookMovePattern.substring(4,5))).toString()+columnCharToNumber(rookMovePattern.substring(3,4).charCodeAt(0))
				lastSpecialMoveData = new UndoMoveData();
				lastSpecialMoveData.fromElementParentId = rookParentId;
				lastSpecialMoveData.toElement = $("#"+rookDestinationParentId);
				lastSpecialMoveData.movedPieceType = $("#"+rookParentId).children(":first-child")
				lastSpecialMoveData.removedPieceType = $("#"+rookDestinationParentId).children(':first-child').clone()
				chessboard.visualiseMoveOnBoard(rookResponseMap)
			}
			handleChessServiceRequest(moveDesc);

			chessboard.disableDragAndDrop()
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
        initializeChess: function(){
        	chessboard.initializeDragAndDrop();
        },		
		
	}
};