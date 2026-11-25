namespace Ex3;

public record GameView(int Ore, int Grain, int Timber, int Clay);

public interface IStrategy
{
    string Next(GameView v);
}

public class CitiesFirst : IStrategy
{
    public string Next(GameView v) => v.Ore >= 3 && v.Grain >= 2 ? "city" : "wait";
}

public class RoadRush : IStrategy
{
    public string Next(GameView v) => v.Timber >= 1 && v.Clay >= 1 ? "road" : "wait";
}

public class BotPlayer(IStrategy strategy)
{
    public string NextMove(GameView v) => strategy.Next(v);
}

public class LambdaStrategy(Func<GameView, string> next) : IStrategy
{
    public string Next(GameView v) => next(v);
}

public static class Bots
{
    public static BotPlayer CitiesFirst() => new(new CitiesFirst());
    public static BotPlayer RoadRush() => new(new RoadRush());

    public static BotPlayer Trader() => new(new LambdaStrategy(v =>
        new[] { v.Ore, v.Grain, v.Timber, v.Clay }.Any(n => n >= 4) ? "trade" : "wait"));
}
