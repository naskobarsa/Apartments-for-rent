using System;

class AdvancedLoops
{
    static void Main()
    {
        int number = int.Parse(Console.ReadLine());

        for (int i = 1; i < number; i+=3)
        {
            Console.WriteLine(i);
        }

    }
}