namespace Ex6;

public interface ICommand
{
    void Execute(Game game);
    void Undo(Game game);
}

public record BuildRoad(string Where) : ICommand
{
    public void Execute(Game game) => game.Roads.Add(Where);
    public void Undo(Game game) => game.Roads.RemoveAt(game.Roads.LastIndexOf(Where));
}

public record Harvest : ICommand
{
    public void Execute(Game game) => game.Grain += 2;
    public void Undo(Game game) => game.Grain -= 2;
}

public class Game
{
    private readonly Stack<ICommand> history = new();

    public List<string> Roads { get; private set; } = [];
    public int Grain { get; internal set; }

    public void Click(string action, string arg) => Play(action switch
    {
        "road" => new BuildRoad(arg),
        "harvest" => new Harvest(),
        _ => throw new ArgumentOutOfRangeException(nameof(action)),
    });

    public void Play(ICommand command)
    {
        history.Push(command);
        command.Execute(this);
    }

    public void Undo() => history.Pop().Undo(this);

    public Snapshot Save() => new([.. Roads], Grain);

    public void Restore(Snapshot save)
    {
        Roads = [.. save.Roads];
        Grain = save.Grain;
        history.Clear();
    }

    public sealed class Snapshot
    {
        internal Snapshot(List<string> roads, int grain) => (Roads, Grain) = (roads, grain);
        internal List<string> Roads { get; }
        internal int Grain { get; }
    }
}
