from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/check_winner', methods=['POST'])
def check_winner():
    data = request.json
    board = data['board']
    
    # All possible winning combinations
    win_conditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # columns
        [0, 4, 8], [2, 4, 6]              # diagonals
    ]
    
    for condition in win_conditions:
        if board[condition[0]] == board[condition[1]] == board[condition[2]] != "":
            return jsonify({
                'winner': board[condition[0]],
                'winningCells': condition,
                'isTie': False
            })
    
    if "" not in board:
        return jsonify({'winner': None, 'isTie': True})
    
    return jsonify({'winner': None, 'isTie': False})

if __name__ == '__main__':
    app.run(debug=True)