package ai.machinelearning.boots;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.function.Consumer;

public class Solution {

    private final static int EMPTY = 0;
    private final static int HIT = 1;
    private final static int MISSED = 2;
    private final static int DESTROYED = 3;

    private final static int BOARD_SIZE = 10;
    private final static int INITIAL_PROBABILITY = 1;

    private final static int FIELD_ON_LINE_VALUE = 100000000;

    private final static int FIELD_ON_EMPTY_LINE = 1000;


    private final static double EMPTY_AREA_FACTOR = 1.0d;

    private final static double TOTAL_PROBABILITY = 1.0d;

    private static Map<Integer,List<int []>> calculateEmptySpaces(int [] board, int [] remainingShips){
        Map<Integer,List<int []>> result = new HashMap<>();
//        int [] result = new int[BOARD_SIZE*BOARD_SIZE];
        // calculate horizontally
        for(int i = 0;i<BOARD_SIZE;i++){
            int emptiesInRow = 0;
            for(int j =0;j<BOARD_SIZE;j++){
                if(board[i*BOARD_SIZE+j] != EMPTY) {
                    if(emptiesInRow>1){
                        if(emptiesInRow==2 && remainingShips[1] > 0) {
                            addAreaForSize(result, emptiesInRow, i*BOARD_SIZE+j, new Integer(2));
                        }
                        if(emptiesInRow==3 && remainingShips[2] > 0) {
                            addAreaForSize(result, emptiesInRow, i*BOARD_SIZE+j, new Integer(3));
                        }
                        if(emptiesInRow==4 && remainingShips[3] > 0) {
                            addAreaForSize(result, emptiesInRow, i*BOARD_SIZE+j, new Integer(4));
                        }
                        if(emptiesInRow==5 && remainingShips[4] > 0) {
                            addAreaForSize(result, emptiesInRow, i*BOARD_SIZE+j, new Integer(5));
                        }

                    }
                    emptiesInRow = 0;
                }
                else emptiesInRow++;
            }
        }
        return result;
    }

    private static void addAreaForSize(Map<Integer, List<int[]>> result, int emptiesInRow, int endField, Integer key) {
        int[] array = { endField, emptiesInRow};
        List<int[]> list = result.get(key);
        list.add(array);
        result.put(key, list);
    }

    private static int [] calculateEmptyAreaBonus(int [] board, double [] probBoard, int [] remainingShips){
        int [] result = new int[board.length];
        Map<Integer,List<int []>> emptySpaces  = calculateEmptySpaces(board,remainingShips);
        for(Integer key : emptySpaces.keySet()){
            List<int []> listOfEmptyAreas = emptySpaces.get(key);
            int numberOfFields = listOfEmptyAreas.stream().map( element -> element[1]).reduce(0,(a,b) -> a+b);
            double probabilityOfOneField = TOTAL_PROBABILITY / (double) numberOfFields;
            listOfEmptyAreas.stream().forEach( element -> {
                fillProperBoardFields(element, probBoard, key.intValue(), probabilityOfOneField);
            });
        }
        return result;
    }

    private static void fillProperBoardFields(int [] element, double[] probBoard, int step, double fieldProb) {
        for(int i = step; i < element[1];i+=step){
            probBoard[element[0]-i] = fieldProb* EMPTY_AREA_FACTOR* step;
        }
    }

    private static int calculateFullShipPossibility(int [] board, int index){
        int x = index / 10;
        int y = index % 10;
        for(int xi = -1; xi <= 1;xi++) {
            for (int yi = -1; yi <= 1; yi++) {
                if(xi == 0 || yi == 0){
                    int nx = x + xi;
                    int ny = y + yi;
                    int counter = 0;
                    while (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && board[nx * BOARD_SIZE + ny] == HIT) {
                        counter++;
                        nx = nx+xi;
                        ny = ny+yi;
                    }
                    if(counter>1) return FIELD_ON_LINE_VALUE;
                }
            }
        }
        return 0;
    }

    private static int calculateAdjacentFields(int [] board, int index){
        int probability = INITIAL_PROBABILITY;
        int x = index / 10;
        int y = index % 10;
        for(int xi = -1; xi <= 1;xi++) {
            for (int yi = -1; yi <= 1; yi++) {
                int nx = x + xi;
                int ny = y + yi;
                if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
                    if ((xi == 0 || yi == 0) && board[nx * BOARD_SIZE + ny] == HIT) {
                        probability += 10000;
                    }
                    if ((xi == 0 || yi == 0) && board[nx * BOARD_SIZE + ny] == DESTROYED) {
                        return 0;
                    }
                }
            }
        }
        return probability;
    }

    private static int calculateProbability(int [] board, int index){
        int probability = 0;
        switch (board[index]){
            case EMPTY: {
                probability = calculateAdjacentFields(board, index);
                probability += calculateFullShipPossibility(board, index);
            } break;
            case HIT:probability = 0; break;
            case MISSED: probability = 0; break;
            case DESTROYED: probability = 0; break;
        }
        return probability;
    }

    private static int [] calculateProbabilityMatrix(int [] board){
        int [] probabilityMatrix = new int[100];

        for(int index = 0;index<board.length;index++){
            probabilityMatrix[index] = calculateProbability(board, index);
//            probabilityMatrix[index] += calculateFullShipPossibility(board, index);
        }
        return probabilityMatrix;
    }

    private static double [] normalizeProbabilityMatirx(int [] probabililtyBoard){
        double [] normalizedProbabilityMatrix = new double[probabililtyBoard.length];
        double sum = 0;

        for(int i =0;i < probabililtyBoard.length;i++){
            sum+= probabililtyBoard[i];
        }
        normalizedProbabilityMatrix[0] = ((double)probabililtyBoard[0])/sum;
        for(int i = 1;i< probabililtyBoard.length;i++){
            normalizedProbabilityMatrix[i] = ((double)probabililtyBoard[i])/sum+normalizedProbabilityMatrix[i-1];
        }
        return normalizedProbabilityMatrix;
    }

    private static int getNumberOfCell( double shot,double [] normalizedProbabilityMatrix){
        int index = 0;
        while(shot > normalizedProbabilityMatrix[index] ) index++;
        return index;
    }

    private static int guessCell(int [] board){
        int [] probabilityBoard = calculateProbabilityMatrix(board);
        double [] normalizedProbabilityBoard = normalizeProbabilityMatirx(probabilityBoard);
        double shot = Math.random();
        return getNumberOfCell(shot, normalizedProbabilityBoard);
    }

    private static void printCell(int cell){
        System.out.print((cell / BOARD_SIZE) + " "+( cell % BOARD_SIZE));
    }

    public static void main(String [] args){
        Scanner scanner = new Scanner(System.in);
        int boardSize = Integer.parseInt(scanner.nextLine().trim());
        int [] board = new int[100];
        for(int index = 0;index < boardSize;index++){
            String line = scanner.nextLine().trim();
            for(int j = 0;j<BOARD_SIZE;j++){
                switch (line.charAt(j)){
                    case 'h': board[index*BOARD_SIZE+j] = HIT; break;
                    case 'm': board[index*BOARD_SIZE+j] = MISSED; break;
                    case 'd': board[index*BOARD_SIZE+j] = DESTROYED; break;
                    default : board[index*BOARD_SIZE+j] = EMPTY; break;
                }
            }
        }
        printCell(guessCell(board));
    }
}
