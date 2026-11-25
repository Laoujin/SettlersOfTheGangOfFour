namespace Ex2;

public class Game
{
    public List<string> Log { get; } = [];
    public bool BanditOnYourTile { get; init; }
    public int Roll() => 8;
}

public class HumanTurn
{
    public void Play(Game game)
    {
        var n = game.Roll();
        game.Log.Add($"rolled {n}");
        game.Log.Add("human builds");
        game.Log.Add("end");
    }
}

public class BotTurn
{
    public void Play(Game game)
    {
        game.Log.Add($"rolled {game.Roll()}");
        game.Log.Add("bot builds");
        game.Log.Add("end");
    }
}
