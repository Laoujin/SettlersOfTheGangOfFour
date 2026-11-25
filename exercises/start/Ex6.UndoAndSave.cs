namespace Ex6;

public class Game
{
    public List<string> Roads { get; } = [];
    public int Grain { get; private set; }

    public void Click(string action, string arg)
    {
        switch (action)
        {
            case "road":
                Roads.Add(arg);
                break;
            case "harvest":
                Grain += 2;
                break;
        }
    }

    public void Undo() => throw new NotImplementedException();
    public object Save() => throw new NotImplementedException();
    public void Restore(object save) => throw new NotImplementedException();
}
