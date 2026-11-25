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

public class Dice(IEnumerable<int> script)
{
    private readonly IEnumerator<int> rolls = script.GetEnumerator();

    public event Action<int>? Rolled;

    public int Roll()
    {
        rolls.MoveNext();
        Rolled?.Invoke(rolls.Current);
        return rolls.Current;
    }
}

public static class Table
{
    public static Dice Setup(Board board, Bandit bandit, Chat chat, params int[] script)
    {
        var dice = new Dice(script);
        dice.Rolled += n => { if (n == 7) bandit.Move(); };
        dice.Rolled += n => { if (n != 7) board.Produce(n); };
        dice.Rolled += n => chat.Say($"rolled {n}");
        return dice;
    }
}
