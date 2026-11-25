namespace Ex4;

public class Board
{
    public List<int> Produced { get; } = [];
    public void Produce(int n) => Produced.Add(n);
}

public class Bandit
{
    public int Moves { get; private set; }
    public void Move() => Moves++;
}

public class Chat
{
    public List<string> Lines { get; } = [];
    public void Say(string line) => Lines.Add(line);
}

public class Dice(Board board, Bandit bandit, IEnumerable<int> script)
{
    private readonly IEnumerator<int> rolls = script.GetEnumerator();

    public int Roll()
    {
        rolls.MoveNext();
        var n = rolls.Current;
        if (n == 7)
            bandit.Move();
        else
            board.Produce(n);
        return n;
    }
}

public static class Table
{
    public static Dice Setup(Board board, Bandit bandit, Chat chat, params int[] script) => new(board, bandit, script);
}
