var boardRepresentation = function(){



	return {
		drawBoard: function( $boardArea, boardPresentation){
			$("tr", $boardArea).each( function(row){
				var tr = this;
				$(tr).children().each(function( col){
					$(this).empty();
					$(this).append(boardPresentation[row][col]);
				});
			});
		},	
		
        initializeDragAndDrop: function(handleDropOnBoard){
            var $draggableWhite = $("#whitePieces");
            var $draggableBlack = $("#blackPieces");
            var $chessboard = $("#chessboard");

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

            $("td", $chessboard).each(function (item){
                $(this).droppable(
                        {
                            accept: "img",
                            drop: function( event, ui){
                                handleDropOnBoard( ui.draggable, $(this));
                            }

                        });
            });
        },

	  	enableDragAndDrop: function(){
			$("body").attr("ondragstart","return true;")
		},

		disableDragAndDrop : function(){
			$("body").attr("ondragstart","return false;")
		}

	}
}