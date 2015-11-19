var app = angular.module('tictactoe',[]);

app.controller('playController',['$scope','$timeout','$window', function($scope,$timeout,$window){
	$scope.board = {};// initialize the board object
	$scope.reset = function(){
		angular.forEach([1,2,3,4,5,6,7,8,9],function(positionValue){//empty out the board
			$scope.board[positionValue] = "";// set the position to empty string
		});
		$scope.winningValues = [];
		$scope.player = 'X'// X starts first!
		$scope.error = false;
	}
	
	$scope.reset()// initializing or someone hit the reset button.
	var wins = { // Since this is private we don't need to add to the scope
		top:[1,2,3],middle:[4,5,6],bottom:[7,8,9],left:[1,4,7],
		midup:[2,5,8],right:[3,6,9],diagLeft:[1,5,9],diagRight:[3,5,7]
	};
	//Bind the resize event to thw window.  This will allow the game to work anywhere.  
	//If we use bootstrap's rows and columns, resizing will lose the 3x3 grid.
	angular.element($window).bind('resize', function () {
		$scope.windowHeight = $window.innerHeight;
		$scope.windowWidth  = $window.innerWidth;
		if(!$scope.$digest()){// make sure we redraw the screen
			$scope.$apply()
		}
	});
	
	// $scope.windowHeight = $window.innerHeight;
	// $scope.windowWidth = $window.innerWidth;
	$scope.move = function(placement){
		if($scope.winningValues.length>0){return}// The game is over and someone is still playing.
		if($scope.board[placement]){//Someone is trying selecting a taken position.
			$scope.error = true; //show error on the screen
			$timeout(function(){$scope.error = false;},5000)//Remove the error after 5 seconds.
			return //We return so the position is not taken.
		}
		$scope.board[placement] = $scope.player//Making the move by setting the position with the players letter. 
		if(!$scope.checkForWin()){// Check for win if a winner exists no need to continue.  We will display the winner on the page.
			$scope.switchPlayer();// Switch player if there is no winner.
		}
	}
	
	$scope.checkForWin = function(){
		angular.forEach(wins,function(values,winType){ // Loop through possible win scenarios.
			if(!$scope.winningValues.length>0 && $scope.board[values[0]] && $scope.board[values[0]] == $scope.board[values[1]] && $scope.board[values[0]] == $scope.board[values[2]]){
				$scope.winningValues = values // If all the positions in this scenario are equal then the game is over. //This will allow us to display the winning positions.
				$scope.flicker(0);//make the winning values flicker
			}
		});
		return ($scope.winningValues.length>0)
	}
	
	$scope.switchPlayer = function(){
		$scope.player = ($scope.player == 'X'?'O':'X');//Ternary to switch user.
	}
	//Show the winning positions.
	$scope.flicker = function(pos){
		$scope.board[$scope.winningValues[pos]] = '' //Empty the position.
		$timeout(function(){//Let it sit for half a second.
			$scope.board[$scope.winningValues[pos]] =  $scope.player; //Put the player's value back now.
			if(pos==2){pos=0;}//Setting the next position of the winning values.  Plus one or start over.
			else{pos+=1;}
			$scope.flicker(pos)//Lets make this recursive! Now it will run forever! Or until the reset button is pushed.
		},500);
	}
}]);
