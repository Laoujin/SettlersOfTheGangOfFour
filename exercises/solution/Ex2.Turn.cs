namespace Ex2;

public class Game
{
    public List<string> Log { get; } = [];
    public bool BanditOnYourTile { get; init; }
    public int Roll() => 8;
}

public record TurnResult(int Rolled);
public record BotTurnResult(int Rolled, string Reason) : TurnResult(Rolled);

public abstract class Turn
{
    public TurnResult Play(Game game)
    {
        if (game.BanditOnYourTile)
            game.Log.Add("bandit!");
        var n = game.Roll();
        game.Log.Add($"rolled {n}");
        Act(game);
        game.Log.Add("end");
        return CreateResult(n);
    }

    protected abstract void Act(Game game);

    protected virtual TurnResult CreateResult(int rolled) => new(rolled);
}

public class HumanTurn : Turn
{
    protected override void Act(Game game) => game.Log.Add("human builds");
}

public class BotTurn : Turn
{
    protected override void Act(Game game) => game.Log.Add("bot builds");

    protected override TurnResult CreateResult(int rolled) => new BotTurnResult(rolled, "cheapest piece first");
}
